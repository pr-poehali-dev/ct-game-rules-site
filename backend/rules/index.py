"""
Business: API для управления правилами и играми сервера
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с request_id, function_name и другими атрибутами
Returns: HTTP response dict с правилами/играми или результатом операции
"""

import json
import os
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создание подключения к БД"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    path_params = event.get('pathParams', {})
    query_params = event.get('queryStringParameters', {})
    
    try:
        conn = get_db_connection()
        
        # GET - получение данных
        if method == 'GET':
            resource_type = query_params.get('type', 'rules')
            
            if resource_type == 'categories':
                result = get_categories(conn)
            elif resource_type == 'games':
                result = get_games(conn)
            else:
                result = get_rules(conn, query_params.get('category'))
            
            conn.close()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        # POST - создание
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            resource_type = body_data.get('type')
            
            if resource_type == 'rule':
                result = create_rule(conn, body_data)
            elif resource_type == 'game':
                result = create_game(conn, body_data)
            else:
                conn.close()
                return error_response('Invalid type', 400)
            
            conn.commit()
            conn.close()
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        # PUT - обновление
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            resource_type = body_data.get('type')
            resource_id = body_data.get('id')
            
            if not resource_id:
                conn.close()
                return error_response('ID required', 400)
            
            if resource_type == 'rule':
                result = update_rule(conn, resource_id, body_data)
            elif resource_type == 'game':
                result = update_game(conn, resource_id, body_data)
            else:
                conn.close()
                return error_response('Invalid type', 400)
            
            conn.commit()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        # DELETE - удаление
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters', {})
            resource_type = query_params.get('type')
            resource_id = query_params.get('id')
            
            if not resource_id:
                conn.close()
                return error_response('ID required', 400)
            
            if resource_type == 'rule':
                delete_rule(conn, resource_id)
            elif resource_type == 'game':
                delete_game(conn, resource_id)
            else:
                conn.close()
                return error_response('Invalid type', 400)
            
            conn.commit()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        conn.close()
        return error_response('Method not allowed', 405)
        
    except Exception as e:
        return error_response(str(e), 500)

def get_categories(conn) -> List[Dict]:
    """Получить все категории"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT code, name, icon, color, display_order 
            FROM rule_categories 
            ORDER BY display_order
        ''')
        return [dict(row) for row in cur.fetchall()]

def get_rules(conn, category: Optional[str] = None) -> List[Dict]:
    """Получить правила (опционально по категории)"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if category:
            cur.execute('''
                SELECT id, category_code, rule_id, title, content, display_order 
                FROM rules 
                WHERE category_code = %s 
                ORDER BY display_order, rule_id
            ''', (category,))
        else:
            cur.execute('''
                SELECT id, category_code, rule_id, title, content, display_order 
                FROM rules 
                ORDER BY category_code, display_order, rule_id
            ''')
        return [dict(row) for row in cur.fetchall()]

def get_games(conn) -> List[Dict]:
    """Получить все игры"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT id, game_id, name, description, min_players, max_weapons, display_order 
            FROM games 
            ORDER BY display_order, name
        ''')
        return [dict(row) for row in cur.fetchall()]

def create_rule(conn, data: Dict) -> Dict:
    """Создать новое правило"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            INSERT INTO rules (category_code, rule_id, title, content, display_order)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, category_code, rule_id, title, content, display_order
        ''', (
            data['category_code'],
            data['rule_id'],
            data['title'],
            data['content'],
            data.get('display_order', 0)
        ))
        return dict(cur.fetchone())

def create_game(conn, data: Dict) -> Dict:
    """Создать новую игру"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            INSERT INTO games (game_id, name, description, min_players, max_weapons, display_order)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, game_id, name, description, min_players, max_weapons, display_order
        ''', (
            data['game_id'],
            data['name'],
            data['description'],
            data.get('min_players'),
            data.get('max_weapons'),
            data.get('display_order', 0)
        ))
        return dict(cur.fetchone())

def update_rule(conn, rule_id: int, data: Dict) -> Dict:
    """Обновить правило"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            UPDATE rules 
            SET title = %s, content = %s, display_order = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, category_code, rule_id, title, content, display_order
        ''', (
            data['title'],
            data['content'],
            data.get('display_order', 0),
            rule_id
        ))
        result = cur.fetchone()
        if not result:
            raise Exception('Rule not found')
        return dict(result)

def update_game(conn, game_id: int, data: Dict) -> Dict:
    """Обновить игру"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            UPDATE games 
            SET name = %s, description = %s, min_players = %s, max_weapons = %s, 
                display_order = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, game_id, name, description, min_players, max_weapons, display_order
        ''', (
            data['name'],
            data['description'],
            data.get('min_players'),
            data.get('max_weapons'),
            data.get('display_order', 0),
            game_id
        ))
        result = cur.fetchone()
        if not result:
            raise Exception('Game not found')
        return dict(result)

def delete_rule(conn, rule_id: int):
    """Удалить правило"""
    with conn.cursor() as cur:
        cur.execute('DELETE FROM rules WHERE id = %s', (rule_id,))
        if cur.rowcount == 0:
            raise Exception('Rule not found')

def delete_game(conn, game_id: int):
    """Удалить игру"""
    with conn.cursor() as cur:
        cur.execute('DELETE FROM games WHERE id = %s', (game_id,))
        if cur.rowcount == 0:
            raise Exception('Game not found')

def error_response(message: str, status_code: int) -> Dict:
    """Вернуть ошибку"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}, ensure_ascii=False),
        'isBase64Encoded': False
    }

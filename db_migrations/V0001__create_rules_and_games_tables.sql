-- Создание таблицы для категорий правил
CREATE TABLE IF NOT EXISTS rule_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для правил
CREATE TABLE IF NOT EXISTS rules (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(50) NOT NULL,
    rule_id VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_code, rule_id)
);

-- Создание таблицы для игр
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    game_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    min_players INTEGER,
    max_weapons INTEGER,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка категорий
INSERT INTO rule_categories (code, name, icon, color, display_order) VALUES
('ct', 'Правила за КТ', 'Shield', 'primary', 1),
('ct-kill', 'КТ могут убить Т за', 'Skull', 'destructive', 2),
('ct-prohibit', 'СТ запрещается', 'Ban', 'accent', 3),
('control', 'Правила за Контрола', 'Crown', 'secondary', 4),
('t', 'Правила за Т', 'Users', 'primary', 5),
('lr', 'Правила LR', 'Swords', 'secondary', 6),
('fd', 'Причины Фридея', 'Flag', 'accent', 7),
('functions', 'Функции для игр', 'Settings', 'primary', 8)
ON CONFLICT (code) DO NOTHING;

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_rules_category ON rules(category_code);
CREATE INDEX IF NOT EXISTS idx_rules_order ON rules(display_order);
CREATE INDEX IF NOT EXISTS idx_games_order ON games(display_order);
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/17d16204-46bd-4d48-8aa7-a8c79d042eb4';

interface Category {
  code: string;
  name: string;
  icon: string;
  color: string;
}

interface Rule {
  id: number;
  category_code: string;
  rule_id: string;
  title: string;
  content: string;
  display_order: number;
}

interface Game {
  id: number;
  game_id: string;
  name: string;
  description: string;
  min_players?: number;
  max_weapons?: number;
  display_order: number;
}

const Admin = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isGameDialogOpen, setIsGameDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, rulesRes, gamesRes] = await Promise.all([
        fetch(`${API_URL}?type=categories`),
        fetch(`${API_URL}?type=rules`),
        fetch(`${API_URL}?type=games`)
      ]);

      const categoriesData = await categoriesRes.json();
      const rulesData = await rulesRes.json();
      const gamesData = await gamesRes.json();

      setCategories(categoriesData);
      setRules(rulesData);
      setGames(gamesData);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRule = async (formData: FormData) => {
    const ruleData = {
      type: 'rule',
      category_code: formData.get('category_code'),
      rule_id: formData.get('rule_id'),
      title: formData.get('title'),
      content: formData.get('content'),
      display_order: parseInt(formData.get('display_order') as string) || 0
    };

    try {
      if (editingRule) {
        await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...ruleData, id: editingRule.id })
        });
        toast({ title: 'Успех', description: 'Правило обновлено' });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ruleData)
        });
        toast({ title: 'Успех', description: 'Правило добавлено' });
      }
      setIsRuleDialogOpen(false);
      setEditingRule(null);
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить правило',
        variant: 'destructive'
      });
    }
  };

  const handleSaveGame = async (formData: FormData) => {
    const gameData = {
      type: 'game',
      game_id: formData.get('game_id'),
      name: formData.get('name'),
      description: formData.get('description'),
      min_players: formData.get('min_players') ? parseInt(formData.get('min_players') as string) : null,
      max_weapons: formData.get('max_weapons') ? parseInt(formData.get('max_weapons') as string) : null,
      display_order: parseInt(formData.get('display_order') as string) || 0
    };

    try {
      if (editingGame) {
        await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...gameData, id: editingGame.id })
        });
        toast({ title: 'Успех', description: 'Игра обновлена' });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gameData)
        });
        toast({ title: 'Успех', description: 'Игра добавлена' });
      }
      setIsGameDialogOpen(false);
      setEditingGame(null);
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить игру',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteRule = async (id: number) => {
    if (!confirm('Удалить это правило?')) return;

    try {
      await fetch(`${API_URL}?type=rule&id=${id}`, { method: 'DELETE' });
      toast({ title: 'Успех', description: 'Правило удалено' });
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить правило',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteGame = async (id: number) => {
    if (!confirm('Удалить эту игру?')) return;

    try {
      await fetch(`${API_URL}?type=game&id=${id}`, { method: 'DELETE' });
      toast({ title: 'Успех', description: 'Игра удалена' });
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить игру',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Icon name="Settings" className="text-primary" size={40} />
              Админ-панель
            </h1>
            <p className="text-muted-foreground">Управление правилами и играми сервера</p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            На главную
          </Button>
        </div>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="rules">
              <Icon name="FileText" size={16} className="mr-2" />
              Правила
            </TabsTrigger>
            <TabsTrigger value="games">
              <Icon name="Gamepad2" size={16} className="mr-2" />
              Игры
            </TabsTrigger>
          </TabsList>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление правилами</h2>
              <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingRule(null)}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить правило
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingRule ? 'Редактировать правило' : 'Новое правило'}
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveRule(new FormData(e.currentTarget));
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="category_code">Категория</Label>
                      <Select name="category_code" defaultValue={editingRule?.category_code} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.code} value={cat.code}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rule_id">ID правила (например: 1.1)</Label>
                      <Input
                        id="rule_id"
                        name="rule_id"
                        defaultValue={editingRule?.rule_id}
                        placeholder="1.1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Заголовок</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={editingRule?.title}
                        placeholder="Название правила"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Описание</Label>
                      <Textarea
                        id="content"
                        name="content"
                        defaultValue={editingRule?.content}
                        placeholder="Полное описание правила"
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="display_order">Порядок отображения</Label>
                      <Input
                        id="display_order"
                        name="display_order"
                        type="number"
                        defaultValue={editingRule?.display_order || 0}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button type="submit">Сохранить</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {categories.map((category) => {
                const categoryRules = rules.filter((r) => r.category_code === category.code);
                if (categoryRules.length === 0) return null;

                return (
                  <Card key={category.code}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="outline">{category.name}</Badge>
                        <span className="text-sm text-muted-foreground">
                          ({categoryRules.length})
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {categoryRules.map((rule) => (
                        <Card key={rule.id} className="border-muted">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">{rule.rule_id}</Badge>
                                  <h4 className="font-semibold">{rule.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">{rule.content}</p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingRule(rule);
                                    setIsRuleDialogOpen(true);
                                  }}
                                >
                                  <Icon name="Pencil" size={14} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteRule(rule.id)}
                                >
                                  <Icon name="Trash2" size={14} />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление играми</h2>
              <Dialog open={isGameDialogOpen} onOpenChange={setIsGameDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingGame(null)}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить игру
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingGame ? 'Редактировать игру' : 'Новая игра'}
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveGame(new FormData(e.currentTarget));
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="game_id">ID игры (например: new-game)</Label>
                      <Input
                        id="game_id"
                        name="game_id"
                        defaultValue={editingGame?.game_id}
                        placeholder="new-game"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Название</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingGame?.name}
                        placeholder="Название игры"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={editingGame?.description}
                        placeholder="Полное описание игры"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min_players">Мин. игроков</Label>
                        <Input
                          id="min_players"
                          name="min_players"
                          type="number"
                          defaultValue={editingGame?.min_players || ''}
                          placeholder="3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max_weapons">Макс. оружий</Label>
                        <Input
                          id="max_weapons"
                          name="max_weapons"
                          type="number"
                          defaultValue={editingGame?.max_weapons || ''}
                          placeholder="5"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="display_order">Порядок отображения</Label>
                      <Input
                        id="display_order"
                        name="display_order"
                        type="number"
                        defaultValue={editingGame?.display_order || 0}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setIsGameDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button type="submit">Сохранить</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <Card key={game.id} className="border-muted">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Icon name="Dice5" className="text-primary" size={20} />
                        {game.name}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {game.min_players && (
                        <Badge variant="outline" className="text-xs">
                          <Icon name="Users" size={12} className="mr-1" />
                          Мин: {game.min_players}
                        </Badge>
                      )}
                      {game.max_weapons && (
                        <Badge variant="outline" className="text-xs">
                          <Icon name="Target" size={12} className="mr-1" />
                          Оружий: {game.max_weapons}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setEditingGame(game);
                          setIsGameDialogOpen(true);
                        }}
                      >
                        <Icon name="Pencil" size={14} className="mr-1" />
                        Изменить
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteGame(game.id)}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

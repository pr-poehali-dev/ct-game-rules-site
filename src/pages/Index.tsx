import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRulesByCategory = (categoryCode: string) => {
    return rules
      .filter((r) => r.category_code === categoryCode)
      .sort((a, b) => a.display_order - b.display_order || a.rule_id.localeCompare(b.rule_id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Icon name="Loader2" className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
            <Icon name="Shield" className="text-primary" size={48} />
            <Icon name="Sword" className="text-accent" size={48} />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
            Правила Сервера
          </h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto animate-fade-in">
            Полный свод правил для игры на JailBreak сервере
          </p>
          <div className="flex justify-center mt-6">
            <Button onClick={() => window.location.href = '/admin'} variant="outline">
              <Icon name="Settings" className="mr-2" size={16} />
              Админ-панель
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="ct" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8 h-auto gap-2">
            <TabsTrigger value="ct" className="flex items-center gap-2">
              <Icon name="Shield" size={16} />
              <span className="hidden sm:inline">КТ</span>
            </TabsTrigger>
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Icon name="Crown" size={16} />
              <span className="hidden sm:inline">Контрол</span>
            </TabsTrigger>
            <TabsTrigger value="t" className="flex items-center gap-2">
              <Icon name="Users" size={16} />
              <span className="hidden sm:inline">Т</span>
            </TabsTrigger>
            <TabsTrigger value="lr" className="flex items-center gap-2">
              <Icon name="Swords" size={16} />
              <span className="hidden sm:inline">LR</span>
            </TabsTrigger>
            <TabsTrigger value="fd" className="flex items-center gap-2">
              <Icon name="Flag" size={16} />
              <span className="hidden sm:inline">FD</span>
            </TabsTrigger>
            <TabsTrigger value="functions" className="flex items-center gap-2">
              <Icon name="Settings" size={16} />
              <span className="hidden sm:inline">Функции</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Icon name="Gamepad2" size={16} />
              <span className="hidden sm:inline">Игры</span>
            </TabsTrigger>
          </TabsList>

          {/* CT Rules */}
          <TabsContent value="ct" className="space-y-6 animate-fade-in">
            {['ct', 'ct-kill', 'ct-prohibit'].map((catCode) => {
              const category = categories.find((c) => c.code === catCode);
              const categoryRules = getRulesByCategory(catCode);
              if (!category || categoryRules.length === 0) return null;

              const colorClass =
                category.color === 'destructive'
                  ? 'border-destructive/20'
                  : category.color === 'accent'
                  ? 'border-accent/20'
                  : 'border-primary/20';

              return (
                <Card key={catCode} className={colorClass}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Icon name={category.icon as any} className={`text-${category.color}`} size={28} />
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryRules.map((rule) => (
                      <Card key={rule.id} className="hover-scale border-muted transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Badge
                              variant={category.color === 'destructive' ? 'destructive' : 'outline'}
                              className="shrink-0"
                            >
                              {rule.rule_id}
                            </Badge>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{rule.title}</h3>
                              <p className="text-sm text-muted-foreground">{rule.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Control Rules */}
          <TabsContent value="control" className="space-y-6 animate-fade-in">
            {(() => {
              const category = categories.find((c) => c.code === 'control');
              const categoryRules = getRulesByCategory('control');
              if (!category || categoryRules.length === 0) return <p>Нет правил</p>;

              return (
                <Card className="border-secondary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-3xl">
                      <Icon name={category.icon as any} className="text-secondary" size={32} />
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryRules.map((rule) => (
                      <Card key={rule.id} className="hover-scale border-muted transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="text-secondary border-secondary shrink-0">
                              {rule.rule_id}
                            </Badge>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{rule.title}</h3>
                              <p className="text-sm text-muted-foreground">{rule.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              );
            })()}
          </TabsContent>

          {/* T Rules */}
          <TabsContent value="t" className="space-y-6 animate-fade-in">
            {(() => {
              const category = categories.find((c) => c.code === 't');
              const categoryRules = getRulesByCategory('t');
              if (!category || categoryRules.length === 0) return <p>Нет правил</p>;

              return (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-3xl">
                      <Icon name={category.icon as any} className="text-primary" size={32} />
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryRules.map((rule) => (
                      <Card key={rule.id} className="hover-scale border-muted transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="text-primary border-primary shrink-0">
                              {rule.rule_id}
                            </Badge>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{rule.title}</h3>
                              <p className="text-sm text-muted-foreground">{rule.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              );
            })()}
          </TabsContent>

          {/* LR Rules */}
          <TabsContent value="lr" className="space-y-6 animate-fade-in">
            {(() => {
              const category = categories.find((c) => c.code === 'lr');
              const categoryRules = getRulesByCategory('lr');
              if (!category || categoryRules.length === 0) return <p>Нет правил</p>;

              return (
                <Card className="border-secondary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-3xl">
                      <Icon name={category.icon as any} className="text-secondary" size={32} />
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryRules.map((rule) => (
                      <Card key={rule.id} className="hover-scale border-muted transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="text-secondary border-secondary shrink-0">
                              {rule.rule_id}
                            </Badge>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{rule.title}</h3>
                              <p className="text-sm text-muted-foreground">{rule.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              );
            })()}
          </TabsContent>

          {/* FD Reasons */}
          <TabsContent value="fd" className="space-y-6 animate-fade-in">
            {(() => {
              const category = categories.find((c) => c.code === 'fd');
              const categoryRules = getRulesByCategory('fd');
              if (!category || categoryRules.length === 0) return <p>Нет правил</p>;

              return (
                <Card className="border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-3xl">
                      <Icon name={category.icon as any} className="text-accent" size={32} />
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryRules.map((rule) => (
                      <Card key={rule.id} className="hover-scale border-muted transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Badge className="shrink-0 bg-accent text-accent-foreground">
                              {rule.rule_id}
                            </Badge>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{rule.title}</h3>
                              <p className="text-sm text-muted-foreground">{rule.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              );
            })()}
          </TabsContent>

          {/* Functions */}
          <TabsContent value="functions" className="space-y-6 animate-fade-in">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <Icon name="Settings" className="text-primary" size={32} />
                  Функции для проведения игр
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="teleport">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Icon name="Navigation" className="text-primary" size={20} />
                        Телепортация
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-muted-foreground">
                      <p>• Телепортация разрешена только для перемещения террористов во время приказов</p>
                      <p>• Телепортировать разрешено в случае, если все Т находятся в одном месте и не бунтуют</p>
                      <p>• Перед телепортацией !control обязан предупредить заранее об этом</p>
                      <p>• Запрещено телепортировать бунтующих террористов</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="additional-functions">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Icon name="Sparkles" className="text-secondary" size={20} />
                        Выдача дополнительных функций
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-muted-foreground">
                      <p>• Разрешается использовать выдачу дополнительных функций только для проведения игр</p>
                      <p>• Перед выдачей !control должен предупредить Т о выдаче функции</p>
                      <p>• После проведения игры !control обязан убрать все дополнительные функции</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="territory">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Icon name="Square" className="text-accent" size={20} />
                        Ограничение территории
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-muted-foreground">
                      <p>• !control имеет право ограничить территорию только для проведения игры</p>
                      <p>• !control обязан убрать ограничение после завершения игры</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Games */}
          <TabsContent value="games" className="space-y-6 animate-fade-in">
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <Icon name="Gamepad2" className="text-secondary" size={32} />
                  Правила игр
                </CardTitle>
              </CardHeader>
              <CardContent>
                {games.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Игры пока не добавлены. Перейдите в админ-панель для добавления.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {games.map((game) => (
                      <Card key={game.id} className="hover-scale transition-all border-muted">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Icon name="Dice5" className="text-primary" size={20} />
                            {game.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-muted-foreground">{game.description}</p>
                          <div className="flex gap-2 flex-wrap pt-2">
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Icon name="Shield" size={16} />
            JailBreak Server Rules
            <Icon name="Sword" size={16} />
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

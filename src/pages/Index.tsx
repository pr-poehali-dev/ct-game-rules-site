import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Rule {
  id: string;
  title: string;
  content: string;
  subrules?: Rule[];
}

interface Game {
  id: string;
  name: string;
  description: string;
  minPlayers?: number;
  maxWeapons?: number;
}

const Index = () => {
  const ctRules: Rule[] = [
    { id: '1.1', title: 'Возраст', content: 'Игра за КТ разрешена только с 12-ти лет (в противном случае КТБан).' },
    { id: '1.2', title: 'Микрофон', content: 'У КТ должен быть исправный микрофон (в противном случае КТБан).' },
    { id: '1.3', title: 'Контроль', content: 'КТ обязаны контролить, либо помогать в этом Контролу.' },
    { id: '1.4', title: 'Становиться Контролом', content: 'Становиться Контролом можно не ограничено - большое количество раз, даже если за КТ 2 игрока и более.' },
    { id: '1.5', title: 'Урон Т', content: 'КТ запрещено убивать/наносить урон Т, если нет на то весомых оснований (!hl - дать аптечку).' },
    { id: '1.6', title: 'Невыполнимые приказы', content: 'КТ не имеет права давать невыполнимые или ведущие к смерти приказы.' },
    { id: '1.7', title: 'Открытие Джайлов', content: 'КТ обязаны открыть Джайлы до 7:00 после приказа Командира, если те не выполнили - объявляется Фридей.' },
    { id: '1.8', title: 'Нычки', content: 'КТ запрещено пользоваться нычками, если нет на то необходимости. КТ могут воспользоваться нычкой предварительно сказав фразу: "Веду преследование".' },
    { id: '1.9', title: 'АФК Т', content: 'КТ может убить стоящего в АФК Т, предварительно отсчитав 10 секунд и назвав его ник.' },
    { id: '1.10', title: 'Оружейка', content: 'КТ запрещено находиться в оружейке после открытия Джайлов (исключение: игра "Прятки").' },
    { id: '1.11', title: 'Повтор приказа', content: 'КТ обязаны повторить свой приказ по просьбе Т, если тот корректный.' },
    { id: '1.12', title: 'Оружие Т', content: 'КТ запрещается подкидывать оружие Т.' },
    { id: '1.13', title: 'Смерть Контрола', content: 'Если Контрол умер - любой КТ должен занять его место; последний КТ может убить всех Т, кроме 2-х.' },
    { id: '1.14', title: 'Контрол до 7:00', content: 'Если КТ не взяли Контрола до 7:00 - объявляется Фридей.' },
    { id: '1.15', title: 'Суицид', content: 'Запрещен умышленный суицид (убивать себя в огне, лазерах и т.д.).' },
    { id: '1.16', title: 'Убийства в Джайлах', content: 'КТ запрещено убивать в закрытых Джайлах, если нет на то необходимости (Т бунтует, нарушение правил в предыдущем раунде).' },
    { id: '1.17', title: 'Четкость приказов', content: '!control обязан внятно и чётко отдавать приказы. (Устное предупреждение | При повторном наступает 1.2.8).' },
    { id: '1.18', title: 'Слежка за Т', content: 'КТ обязан следить за Т, либо искать бунтующих Т. (Устное предупреждение | При повторном считается за нарушение КТ)' }
  ];

  const ctKillReasons: Rule[] = [
    { id: '1.1.1', title: 'Ранение КТ', content: 'Ранение КТ (убийство на рассмотрение Контрола).' },
    { id: '1.1.2', title: 'Территория КТ', content: 'Нахождение на территории КТ (требуется отсчет).' },
    { id: '1.1.3', title: 'Нычка', content: 'Нахождение в нычке (требуется отсчет).' },
    { id: '1.1.4', title: 'Побег', content: 'Побег (можно дать время на исправление).' },
    { id: '1.1.5', title: 'ЛР', content: 'Если Т не пишет ЛР (требуется отсчет; правило работает после 3:30).' }
  ];

  const controlRules: Rule[] = [
    { id: '2.1', title: 'Взятие Контрола', content: 'Любой из КТ может стать Контролом (!control).' },
    { id: '2.2', title: 'Пост', content: 'Контрол не имеет право покидать пост и убивать Т, даже если он остался последний из КТ.' },
    { id: '2.3', title: 'Приказы', content: 'Контрол должен давать приказы точно, четко и понятно для окружающих.' },
    { id: '2.4', title: 'Отказы', content: 'Контрол обязан рассмотреть "отказ" в течении 30 секунд, если же тот не рассмотрел - он обязан дать Т (который написал "отказ") Фридей.' },
    { id: '2.5', title: 'Фридей', content: 'Контролу запрещено выдавать Фридей без причины ("Потому, что я так захотел" - не имеет смысла).' },
    { id: '2.6', title: 'Заместитель', content: 'Контрол может выбрать своего заместителя, который после его смерти - обязан взять командование на себя, даже если останется последним КТ.' },
    { id: '2.7', title: 'Дополнительные приказы', content: 'Если Контрол дает дополнительный приказ, то он отменяется отдельно от основных приказов. Отменяют со словами: "Я отменяю дополнительные приказы".' },
    { id: '2.8', title: 'Телепорт и карцер', content: 'Контрол не имеет право телепортировать в Джайл (можно с согласия Т), забирать заточку (только во время игры "Прятки") и помещать в карцер, если нет на то оснований.' },
    { id: '2.9', title: 'Возрождение', content: 'Контрол может попросить Администратора возродить Т, который случайно был убит.' },
    { id: '2.10', title: 'Микрофон', content: 'Если игроки явно мешают командовать - Контрол может попросить Администратора отключить им микрофон.' },
    { id: '2.11', title: 'Первый день', content: 'Контрол обязан дать Фридей, если он первый день контролит или первый раунд на карте.' },
    { id: '2.12', title: 'Объяснения', content: 'Контрол обязан объяснять свои приказы и игры.' }
  ];

  const tRules: Rule[] = [
    { id: '3.1', title: 'Бунт', content: 'Т имеют право взбунтоваться в любое время, кроме ЛР.' },
    { id: '3.2', title: 'Отказ', content: 'Т имеют право в любой момент отказаться от приказа ("Отказ! Причина." или "Отказ. Причина.").' },
    { id: '3.3', title: 'Выполнение приказов', content: 'Т обязаны выполнять все приказы Командира, кроме тех, которые ведут к гибели, либо невыполнимые.' },
    { id: '3.4', title: 'Игровой процесс', content: 'Т запрещается задерживать игровой процесс глупыми доводами/вопросами, которые не относятся к конкретному приказу Командира.' },
    { id: '3.5', title: 'Резать КТ', content: 'T могут резать КТ' }
  ];

  const ctProhibitions: Rule[] = [
    { id: '3.3.1', title: 'Нычки', content: 'Ломать или залезать в нычки. (Искл. п. 3.2.5, lr, прятки, оборона.) (Наказание слей, !control\'у слей не дается).' },
    { id: '3.3.2', title: 'Оружейка после 2:00', content: 'Находиться в оружейке после 2:00 (Искл. п. 3.2.5, lr и прятки) (Наказание слей, !control\'у слей не дается).' },
    { id: '3.3.3', title: 'Джайлы после 3:00', content: 'Держать джайлы закрытыми ПОСЛЕ 3:00 (за нарушение слей всем КТ, только !control получает нарушение за КТ).' },
    { id: '3.3.4', title: 'Закрытие джайлов', content: 'Закрывать джайлы. (Наказание слей, !control\'у слей не дается).' },
    { id: '3.3.5', title: 'Оружие T', content: 'Подкидывать оружие T. (Наказание слей, !control\'у слей не дается).' },
    { id: '3.3.6', title: 'Вышки', content: 'Залезать на вышки, уже занятые двумя CT. (Наказание слей, !control\'у слей не дается).' },
    { id: '3.3.7', title: 'Убийства в джайлах', content: 'Запрещено убивать в закрытых джайлах (Искл. Пункт 3.2.2 и 3.2.3) (Наказание слей, !control\'у слей не дается).' },
    { id: '3.3.8', title: 'Контрол после 2:00', content: 'Взятие !control после 2:00 запрещено. (Искл. Заместитель).' },
    { id: '3.3.9', title: 'Лояльность', content: 'Относится лояльно к бунтующим Т.' },
    { id: '3.3.10', title: 'Убийство без причины', content: 'Убивать Т без причины. (Если Т не реснули сразу, то наказание слей, !control\'у слей не дается).' },
    { id: '3.3.11', title: 'Открытие джайлов', content: 'Открывать джайлы без разрешения !control\'a. (Искл. !control не успел открыть джайлы вовремя.) (Наказание слей, !control\'у слей не дается).' },
    { id: '3.3.12', title: 'Последний КТ', content: '!control не имеет права прекращать контролить, если он остался последним КТ. (Искл. FD). (Наказание слей, !control\'у слей не дается).' },
    { id: '3.3.13', title: 'Суицид', content: 'Делать преднамеренный суицид до окончания таймера.' }
  ];

  const lrRules: Rule[] = [
    { id: '5.1.1', title: 'Начало LR', content: 'Когда остаются 2 T, начинается lr. (Искл. оборона, прятки и zfd)' },
    { id: '5.1.2', title: 'Команда !lr', content: 'Во время lr T имеют право написать «!lr».' },
    { id: '5.1.3', title: 'Отмена приказов', content: 'Во время lr отменяются все приказы и заканчиваются все игры.' },
    { id: '5.1.4', title: 'Время на !lr', content: 'Если T не пишет «!lr» в общий чат, CT имеют право убить его, досчитав до 10.' },
    { id: '5.1.5', title: 'Выбор игры', content: 'Если T не выбирает игру, CT имеют право убить его, досчитав до 10.' },
    { id: '5.1.6', title: 'Отказы CT', content: 'Если CT дважды отказался от двух разных игр lr, то вы можете его убить.' },
    { id: '5.1.7', title: 'Бунт в LR', content: 'Бунт во время lr осуществляется только через соответствующий пункт. (В другом случае нарушение со стороны Т)' },
    { id: '5.1.8', title: 'Отмена админом', content: 'Админ имеет право отменить все предыдущие !lr только 3 раза за раунд.' }
  ];

  const fdReasons: Rule[] = [
    { id: '6.1.1', title: 'Нет контрола', content: '!control не был взят до 3:30.' },
    { id: '6.1.2', title: 'Первый раунд', content: 'Первый раунд на карте.' },
    { id: '6.1.3', title: 'Заместитель', content: 'Заместитель не взял !control\'a в течение 15 с.' },
    { id: '6.1.4', title: 'Дисбаланс', content: 'Соотношение T к живым CT в 3:00 меньше 2. (дисбаланс)' },
    { id: '6.1.5', title: 'Джайлы открыты', content: 'Джайлы были открыты до взятия !control\'a или до выдачи первого приказа.' },
    { id: '6.1.6', title: 'Закрытие джайлов', content: 'CT закрыли джайлы.' },
    { id: '6.1.7', title: 'Отказ не устранен', content: 'Причина вашего отказа не была устранена в течение 15 с.' },
    { id: '6.1.8', title: 'Победа в LR', content: 'T выиграли lr в предыдущем раунде.' },
    { id: '6.1.9', title: 'Убийство в LR', content: 'СТ убили Т во время !lr без причины.' },
    { id: '6.1.10', title: 'Личный FD', content: '!control лично дал вам fd. (Не более одному Т.)' },
    { id: '6.1.11', title: 'Победа в обороне', content: 'Вы выиграли оборону.' },
    { id: '6.1.12', title: 'Массовый фрикилл', content: 'Массовый фрикилл 3+.' },
    { id: '6.1.13', title: 'Победа в прятках', content: 'Вы выиграли прятки.' },
    { id: '6.1.14', title: 'Не реснули', content: 'Вас случайно убили в прошлом раунде и не реснули.' },
    { id: '6.1.15', title: 'Два FD', content: 'Если уже есть два Т с FD.' },
    { id: '6.1.16', title: 'Джайлы после 3:00', content: 'Джайлы были открыты после 3:00.' }
  ];

  const games: Game[] = [
    {
      id: 'field-of-miracles',
      name: 'Поле чудес',
      description: '!control выстраивает Т в ряд. После чего придумывает слово, указывает сколько в нем букв и называет Т по очереди, те в свою очередь должны называть по одной букве на ход.',
      minPlayers: 3
    },
    {
      id: 'virus',
      name: 'Вирус',
      description: '!control определяет территорию для Т, которую им запрещено покидать. !control определяет любым способом «вируса» среди террористов.',
      minPlayers: 5
    },
    {
      id: 'billiard',
      name: 'Бильярд',
      description: '!control с помощью FSA ставит большой стол и на него бананы. Вызывает к столу 2Т, которые будут играть между собой.',
      minPlayers: 3
    },
    {
      id: 'catch-it',
      name: 'Ну, погоди!',
      description: '!control определяет территорию для Т и встает на возвышенность над ними. Далее !control бросает с верху вниз любое оружие или снаряжение.',
      minPlayers: 3
    },
    {
      id: 'jumpers',
      name: 'Попрыгушки',
      description: '!control приказывает Т, образуя круг. Т не сходят с места до конца игры. !control становится по центру и стреляет только по ногам.',
      minPlayers: 5
    },
    {
      id: 'minefield',
      name: 'Минное поле',
      description: 'Все террористы должны стоять в одной шеренге и направлены лицом в противоположную сторону от !control\'a. Обозначает территорию для игры.',
      minPlayers: 6
    },
    {
      id: 'time',
      name: 'Время',
      description: '!control обозначает любые четыре джайлов определенным временем. После чего называет время и Т должны выбрать джайл со временем ближе всего к названому.'
    },
    {
      id: 'arithmetic',
      name: 'Арифметика',
      description: '!control ставит желаемое количество столов с помощью FSA. Обозначает каждый стол определенной цифрой и говорит математический пример.',
      minPlayers: 3
    },
    {
      id: 'deadly-clip',
      name: 'Смертельная обойма',
      description: '!control перед Т ставит в ряд несколько оружий. Берет каждое оружие по очереди, выстреливает n-количество раз и называет количество патронов.',
      minPlayers: 3,
      maxWeapons: 5
    },
    {
      id: 'lucky-one',
      name: 'Везунчик',
      description: 'Все террористы стоят в одной шеренге. !control размещает оружие на одинаковом расстоянии перед Т с разным количеством патронов.'
    },
    {
      id: 'intuition',
      name: 'Интуиция',
      description: '!control выстреливает из скорострельного оружия патроны, а Т должны угадать, сколько патронов осталось в магазине.'
    },
    {
      id: 'spray',
      name: 'Спрей',
      description: 'Т ставят спрей(лого) на одной плоскости по условиям !control, умирает тот, кто ниже поставит.'
    },
    {
      id: 'reverse',
      name: 'Наоборот',
      description: 'Ведущий пишет любое слово в чат либо задом наперёд, либо как обычно. Т должны перевести слово.',
      minPlayers: 3
    },
    {
      id: 'survive-or-die',
      name: 'Выжить или умереть',
      description: '!Control стреляет строго с кортов с включённым фонариком. Если стреляет из дигла вверх Т прыгают, если вниз Т стоят.'
    },
    {
      id: 'king',
      name: 'Король',
      description: '!control говорит в голосовой чат слово или несколько слов. Побеждает тот Т, который первым правильно напишет. Режимы: Злой, Добрый, Пьяный, Прокурор.'
    }
  ];

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

          {/* КТ Rules */}
          <TabsContent value="ct" className="space-y-6 animate-fade-in">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <Icon name="Shield" className="text-primary" size={32} />
                  Требования игры за КТ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ctRules.map((rule) => (
                  <Card key={rule.id} className="hover-scale border-muted transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="text-primary border-primary shrink-0">
                          {rule.id}
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

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Icon name="Skull" className="text-destructive" size={28} />
                  КТ могут убить Т за:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ctKillReasons.map((rule) => (
                  <Card key={rule.id} className="border-destructive/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge variant="destructive" className="shrink-0">
                          {rule.id}
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

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Icon name="Ban" className="text-accent" size={28} />
                  СТ запрещается:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ctProhibitions.map((rule) => (
                  <Card key={rule.id} className="border-accent/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="shrink-0 bg-accent text-accent-foreground">
                          {rule.id}
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
          </TabsContent>

          {/* Control Rules */}
          <TabsContent value="control" className="space-y-6 animate-fade-in">
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <Icon name="Crown" className="text-secondary" size={32} />
                  Правила игры за Контрола
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {controlRules.map((rule) => (
                  <Card key={rule.id} className="hover-scale border-muted transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="text-secondary border-secondary shrink-0">
                          {rule.id}
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
          </TabsContent>

          {/* T Rules */}
          <TabsContent value="t" className="space-y-6 animate-fade-in">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <Icon name="Users" className="text-primary" size={32} />
                  Правила игры за Т
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tRules.map((rule) => (
                  <Card key={rule.id} className="hover-scale border-muted transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="text-primary border-primary shrink-0">
                          {rule.id}
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
          </TabsContent>

          {/* LR Rules */}
          <TabsContent value="lr" className="space-y-6 animate-fade-in">
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <Icon name="Swords" className="text-secondary" size={32} />
                  Правила LR (Last Request)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lrRules.map((rule) => (
                  <Card key={rule.id} className="hover-scale border-muted transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="text-secondary border-secondary shrink-0">
                          {rule.id}
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
          </TabsContent>

          {/* FD Reasons */}
          <TabsContent value="fd" className="space-y-6 animate-fade-in">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <Icon name="Flag" className="text-accent" size={32} />
                  Причины наступления Фридея
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fdReasons.map((rule) => (
                  <Card key={rule.id} className="hover-scale border-muted transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="shrink-0 bg-accent text-accent-foreground">
                          {rule.id}
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
                      <p>• Запрещено телепортировать бунтующих террористов, во время фд, мирного фд, жфд, зфд, обороны, пряток</p>
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
                      <p>• Перед выдачей !control должен предупредить Т о выдаче той или иной функции во время игры</p>
                      <p>• Выдача дополнительных функций разрешена в случае, если ни у кого из Т нет оружия</p>
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
                      <p>• !control имеет право ограничить территорию только для проведения игры и после ее объявления</p>
                      <p>• !control обязан убрать ограничение в территории после завершения игры</p>
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
                        <p className="text-sm text-muted-foreground line-clamp-3">{game.description}</p>
                        <div className="flex gap-2 flex-wrap pt-2">
                          {game.minPlayers && (
                            <Badge variant="outline" className="text-xs">
                              <Icon name="Users" size={12} className="mr-1" />
                              Мин: {game.minPlayers}
                            </Badge>
                          )}
                          {game.maxWeapons && (
                            <Badge variant="outline" className="text-xs">
                              <Icon name="Target" size={12} className="mr-1" />
                              Оружий: {game.maxWeapons}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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

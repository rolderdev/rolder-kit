# Changelog

## 2024-05-17 v1.0.0-rc0

Первый Release Candidate. Наведен порядок в нодах, рефакторинг внутренней структуры репозитария. Rspack научился использовать общий конфиг.

### Хештеги

Поскольку весь RK был бетой, хештеги не имели сильного значения. С этого момента будем использовать хештеги у нод в более строгом виде, напомню их значение:

- Нет тега - стабильная, проверенная версия.
- `#preRelease` - добавили новые фичи в ноду или сама нода новая. Разработчики ноды сам решает. Бывает так, что простой параметр добавлен и есть уверенность, что багов быть не может, тогда и не ставит тег. Если же есть что-то серьезное и любой шанс на баг - ставит. RK сделан так, что можно снять тег не ломая проекты. Разработчик проекта обычно использует такие версии, когда есть потребность в новой фиче.
- `#experimental` - проверка гипотезы. Когда нет уверенности, что это вообще взлетит.
- `#deprecated` - ноду планируется удалить. Наш подход к версионности нод удобен, но есть минус - каждая версия занимает место, нужно подчищать.

### Ноды

Проведена ревизия всех нод, расставлены соответсвующие хештеги.

### Local-First

Добавлена новая нода LocalData, новые версии App и Auth для проверки гипотезы `Local-First`. Описание про это в отдельной новости.

### Rolder-Kit

Добавлена синхронность на прием данных между портами и сигналами. Раньше, в некоторых случаях, приходилось в функциях Noodl добавлять ожидание перед отправкой сигнала.isNil

## 2024-05-17 v1.0.0-beta24

### data

- create v1.1.0 - добавлено создание чанками по 100 штук и новая опция `silent`.
- update v1.2.0 - добавлено изменение чанками по 100 штук и новая опция `silent`.
  В обоих случаях, можно подавать записи до 20000 штук, они будут созданы/обновлены чанками по 100 штук, а опцией `silent` мы регулируем, обновлять ли useData по окончании обновления.
  `silent` = true - не обновлять useData
  `silent` = false - обновлять useData

- nodered v1.1.0 - добавлена возможность задавать timeout ожидания ответа от nodeRed сервера. Стандартное значение 10000 мс = 10 с, его может быть не достаточно для различных случаев.

## 2024-05-05 v1.0.0-beta23

### Разработка

- Наведен порядок в репозитарии - почищены лишние импорты, реорганизована структура пакета mantine, донастроена управляющая репозитарием утилита - moon.
- Настроен файл `rolder-kit.code-workspace`. Если открыть его в VSCode, то он предложит установить нужные плагины и настройки для них. Главный плагин - `Prettier`. Он форматирует все используемые языкм в репозитарии по единому стандарту. Это чтобы уйти от вкусовщины оформления кода.
- Добавлена функция `getInspectInfo` в параметры создания ноды. Функиця должна вернуть массив литералов и специальный массив объектов с 2-мя ключами: `type` (варианты - value, text, color, image) и `value`. На входе принимает `props`. Запускается при загрузке и наведении на ноду. Пример:

```js
getInspectInfo(props) {
  if (props.scheme) {
    return [
      { type: 'text', value: 'Это текст' },
      { type: 'image', value: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Sharbat_Gula.jpg' }
      { type: 'value', value: props.scheme }, // если type = value, то сам value может быть объектом, массивом или любым литералом
    ];
  }

  return '[No scheme!]';
}
```

- Добвлен сборщик логов:
  - Логи собираются на внешний [сервер](https://glitchtip.cf.rolder.app/). Нужно добавть проект и в настройка проекта прописать Sentry DSN.
  - Собирает логи как в онлайн режиме, так и оффлайн.
  - Добавлен log.sentryError(error), где error - стандартный обекта ошибки. Try-catch или throw Error.

### Rolder Kit

- Добавлена возможность выводить информацию о состоянии ноды. Пример - таблица показывает скомпилиированную схему.
- Ноды RK больше не показывают Style variant от Noodl, т.к. на уровне RK они не применяются.
- Все просты ноды переведены на статичную загрузку. Динамичная загрузка показала себя плохо при работе с таблицей (баг, когда не всегда разварачивается вложенная таблица). Тяжелые модули остались динамическими, например, сама таблица, гант, веб-камера, все, что в пакете data.

### app

- Добавлен сборщик логов. Собирает любые не пойманые ошибки и ошибки, которые мы умеем ловить сами. Умеет работать в оффлайн.

### mantine

- [Table v1.3.0](https://docs.rolder.app/#/table)
- Перехал AppShell и Tabs. Это последние компоненты, mantine-old больше не нужен.

### pdf

- Добавлен customProps в PdfText, чтобы можно было применять функцию render.
- Добавлен параметр fixed в PdfText как у PdfView, чтобы можно было отрисовывать повотряемый элемент на каждой странице.

### data

- delete v1.1.0 - добавлено удаление чанками по 100 штук и новая опция `silent`. Если удаляем много объектов за раз, то нужно включать `silent`, чтобы не срабатывал `realtime`. Он срабатывает при удаление каждой записи в БД, триггеря все UseData, что использую удаляемы классы. Это вешает как сервер, так и клиент.

### markdown

Новый модуль. Состоит из двух братьев нод - MarkdownViewer и MarkdownEditor.

## 2024-04-08 v1.0.0-beta22/TableSelectionScope v1.0.1

### mantine

#### TableSelectionScope v1.0.1

- Изменил вид выхода selectionScope. Теперь он выдает только объект с id записи и статусом.
- Изменил выход selectionByTableId, где ключи - tableId, а значения - массив выбранных записей на selectionByDBClass, где теперь ключи - название класса, а значения массив выбранных записей.

## 2024-04-08 v1.0.0-beta22

### Rolder Kit

- Monorepo долетел на [турбо](https://turbo.build/repo) до [луны](https://moonrepo.dev/moon). Обратите внимание, изменились названия пакетов.
- Утилита isEmpty не верно отрабатывала тип данных blob.
- Компоненты, у которых есть документация теперь открывают ее по нажаию на вопрос, как в оргинальных компонентах Noodl.

`MD`
Созданы директории:

- rolder-kit/packages/internal/scope/v0.2.0
- rolder-kit/packages/components/ui/mantine/organisms/table/v1.2.0
- rolder-kit/packages/components/ui/mantine/organisms/table/modules/columnFilter/v1.1.0
- rolder-kit/packages/components/ui/mantine/organisms/table/modules/expansionRow/v1.1.0
- rolder-kit/packages/components/ui/mantine/molecules/tableScope/v1.0.0
- rolder-kit/nodes/ui/mantine/molecules/tableSelectionScope

Изменены общие файлы: // MD

- nodes/ui/mantine/mantine.ts

  - ссылка на код: import tableSelectionScopeNode from "@nodes/table-selection-scope"
  - и название ноды: tableSelectionScopeNode
  - в rolder-kit/nodes/ui/mantine/package.json добавлена запись "@nodes/table-selection-scope": "workspace:\*"

- packages/internal/port/v0.6.0/src/ports/data.ts
  - Содержимое атома tableSelectionScope; { name: 'selectionScope', displayName: 'selectionScope', group: 'Data', type: 'object' }
  - Объект, где ключи - tableId, а значения - массив выбранных запсией: { name: 'selectionByTableId', displayName: 'selectionByTableId', group: 'Data', type: 'object' }
- packages/internal/port/v0.6.0/src/ports/table.ts

  - id текущей таблицы: { name: 'tableId', group: 'Data', type: 'string', displayName: 'tableId' }
  - id родительской таблицы: { name: 'parentTableId', group: 'Data', type: 'string', displayName: 'parentTableId' }

- packages/internal/types/v0.1.0/types.d.ts
  - К типу Item добавлено поле для передачи tableId от родительсмкой таблицы дочерним: parentTableId: string | undefined | null
- rolder-kit/nodes/ui/mantine/organisms/table/package.jsonrolder-kit/nodes/ui/mantine/organisms/table/package.json
  - Добавлена ссылка на код с table-1.2.0: "@packages/table-v1.2.0": "workspace:\*"
  - Добавлена соответствующая версия в tableNode.ts
- rolder-kit/nodes/ui/mantine/organisms/table/modules/expansionRow/package.json
  - Добавлена ссылка на код с column-filter-v1.1.0: "@packages/column-filter-v1.1.0": "workspace:\*"
  - Добавлена соответствующая версия в columnFilterNode.ts
- rolder-kit/nodes/ui/mantine/organisms/table/modules/expansionRow/package.json
  - Добавлена ссылка на код с expansion-row-v1.1.0: "@packages/expansion-row-v1.1.0": "workspace:\*"
  - Добавлена соответствующая версия в expansionRowNode.ts

### data

- [UseData v1.3.0](https://docs.rolder.app/docs/data/useData.html#v130-20240404)

### mantine

#### Table v1.2.0

- Теперь при активном expension создается jotai атом и состояния multiSelection обрабатываются специальной функцией. Если обернуть главную таблицу (по сути все дерево таблиц) в tableSelectionScope, то можно будет получать и сбрасывать значение атома.
- Все статусы обрабатываются с учетом иерархии
- Изменены названия используемых scope в соответствии scope-0.2.0
  - Сменились названия компонетов при создании scope 0.2.0
    - cellScope на tableCellScope (Нода tableCell v1.1.0)
    - tableScope на tableFilterScope (Нода tableFilter v1.1.0)
    - Добавился tableCetableSelectionScopellScope
- Выдает на выход свой id и id родительской таблицы (tableId, parentTableId).

#### TableSelectionScope

- Добавлена нода TableSelectionScope, с помощью которой можно получать значения id и статуса multiSelect всех записей, всех таблиц, которые расположены пол данной нодой (в иерархии).
- Можно сбрасывать селекты со всех таблиц иерархии.
- Выдает на выход объект selectionByTableId, где ключи - tableId, а значения - массив выбранных запсией

## 2024-04-01 v1.0.0-beta21

### mantine

#### Table v1.1.2

- Исправлен баг, когда 2 таблицы прыгали в бесконечность.

## 2024-04-01 v1.0.0-beta20

### Rolder Kit

- RK получил свой бекенд для демонстрационных данных в документации.
- Хостинг документации перехал с Github на Yandex.
- Обновлен способ обновления выходных портов. Раньше каждый порт обновлялся отдельно, теперь возможно все порты ноды обновить разом. Есть подозрение, что иногда приходится добавлять таймауты именно из-за этого. Т.к. изменение затрагивает основное поведение многих нод, нужно сначала хорошо это потетсить. Первые примеры - UseData v1.2.0, update v1.1.0

### mantine

- Переведены ноды - Drawer.
- Modal - убран дублирующийся порт.

### data

- [История изменений данных](https://docs.rolder.app/docs/data/history.html)
- [UseData v1.2.0](https://docs.rolder.app/docs/data/useData.html#v120-20240401)
- [update v1.1.0](https://docs.rolder.app/docs/data/update.html)

## 2024-03-28 v1.0.0-beta19

### data

#### UseData v1.1.0

- Поправлен баг - пагинация работала только с классом БД 'task'.

### mantine

- Переведены ноды - Carousel, Modal.

## 2024-03-28 v1.0.0-beta18

### data

- Правки оффлайн-режима. Теперь умеет определять качество сети независимо от платформы.

### mantine

- notification - восстановлен потерянный порт Color.
- Переведены ноды - Grid.

### DatePickerInput v1.0.1

- Поправлен баг - не устаналвивалось значение на выходе, когда подается на вход в контроллируемом режиме.

### pdf

#### PdfDocument v1.2.0

- Добавлен сигнал сброса. Сбрасывает blob в null и выдает сигнал reseted.

## 2024-03-25 v1.0.0-beta17

### data

#### Nodered v1.0.1

- Поправлен баг - было невозможно запустить флоу с пустым Flow data.

#### UseData v1.1.0

- Добавлен сигнал Refetch для редких случаев, когда не срабатывает подписка на изменения. Например, при импорте данных.

### mantine

- Переехали ноды - notification, Divider, DropZone, BarLoader, Loader, Indicator, Avatar, ScrollArea.

## 2024-03-23 v1.0.0-beta16

### data

- Правки оффлайн-режима.

### mantine

#### Table v1.1.1

- Не работал выходной Single selected item.
- Сигналы Expand all и Unexpand all не работали.

### pdf

#### PdfTable v1.3.0

- Добавлена возможность формировать схему колонок функциями:
  - Нужно подать в параметр Get columns объект с ключем getHeaderColumns и/или getRowColumns.
  - Первая подает в себя все items и схему из Columns, на выход нужно выдавать схему колонок. Имеет смысл, когда от содержания всех данных нужно менять заголовок таблицы. Если этой функции нет, будет применен стандартный параметр Columns.
  - Вторая подает в себя item каждой строк и схему из Columns, на выход так же нужно выдавать схему колонок. Если этой функции нет, будет пременен стандартный параметр Columns. Так можно менять состав колонок, их параметры для каждой строки, в зависимости от содержания.
  - Пример объета с обеими функциями:

```js
[
	{
		getHeaderColumns(columns, items) {
			// схема и все items
			if (items.map((i) => i.team).includes('Падонки')) columns[0].title = 'Команда (обнаружены падонки)'; // можно менять columns, т.к. они подаются клонированные
			return columns;
		},
		getRowColumns(columns, item) {
			// схема и item строки
			if (item.team === 'Падонки')
				return [
					{
						// меняем схему полносью по условию
						// title: 'Заголовок', // нам не важен заголовок, т.к. схему применяет строка
						accessor: 'team',
						cellStyle: {
							cell: { backgroundColor: 'red' },
							text: { fontSize: 14 }
						}
					}
				];
			else return columns;
		}
	}
];
```

- Добавлена возможность формировать стили функциями. Стили применяются каскадно - вся таблица, заголовок и ячейка заголовка, строка и ячейка строки:
  - Вся таблица. Вместо Advanced HTML стили таблицы теперь задаются через параметр Table style, чтобы был один подход для всех стилей таблицы. Для обратной совместимости, Advanced HTML применяется и совмещается с Table style, при этом второй выигрывет, когда есть совпадения. Параметр Get table style принимает стили и items таблицы, должен выдавать стили. Пример:

```js
[
	{
		func(style, items) {
			if (items.map((i) => i.team).includes('Падонки'))
				return {
					...style,
					border: 6,
					borderColor: 'red'
				};
			else return style;
		}
	}
];
```

- Заголовок. Добавлены параметры Header style и getHeaderStyle. Первый просто передает стили строке заголовка, вьорой работает как Get table style.
- Ячейка загловка. В схему нужно добавить функцию headerStyleFunc. Работает так же как вышеперечисленные функции, но style берет из headerStyle схемы.
- Строка и ячейка строки работают как заголовок, но функция передает один item строки.
- Пример схемы с функциями ячеек:

```js
[
	{
		title: 'Команда',
		accessor: 'team',
		width: 120,
		headerAlign: 'left',
		cellAlign: 'left',
		headerStyle: {
			cell: { backgroundColor: 'lightblue' },
			text: { fontSize: 16, fontFamily: 'Ubuntu' }
		},
		cellStyle: {
			cell: { backgroundColor: 'cyan' },
			text: { fontSize: 14 }
		}
	},
	{
		title: 'Кэп',
		accessor: 'name',
		width: 120,
		headerAlign: 'left',
		cellAlign: 'left',
		headerStyle: {
			cell: { backgroundColor: 'lightblue' },
			text: { fontSize: 16 }
		},
		headerStyleFunc(style, items) {
			if (items.map((i) => i.name).includes('Гайка'))
				return {
					...style,
					text: { fontSize: 12, fontFamily: 'Ubuntu', fontWeight: 700 }
				};
			else return style;
		},
		cellStyle: {
			cell: { backgroundColor: 'cyan' },
			text: { fontSize: 14 }
		},
		cellStyleFunc(style, item) {
			if (item.name === 'Гайка')
				return {
					...style,
					text: { fontSize: 12, fontFamily: 'Ubuntu', fontWeight: 700 }
				};
			else return style;
		}
	}
];
```

- Применение всего этого показано в проекте-примере PDF.

## 2024-03-19 v1.0.0-beta15

### Общее

- Выключен Module Federation. Один баг оказался из-за него.

### app

- Добавлена страница, которая выдается, если все приложение вылетело из-за ошибки. В корень проекта нужно положить error.jpg

### service-worker

- Удален, не пригодился.

### mantine

#### Table v1.1.0

- Исправлен баг - вложенные таблицы дублировали мултиселект.
- Изменено поведение выбора. Selection и MultiSelection теперь устанавливаются только если поданный выбор есть в поданных items. Таким образом, теперь можно подавать на вход любые items, не боясь, что таблица запомнит выбор от другой таблицы.

### pdf

#### PdfDocument v1.1.0

- Добавлена возможность указывать шрифты и использоать их в других компонентах PDF.
  - Пример шрифтов:

```js
[
	{
		family: 'Inter',
		fonts: [
			{
				src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf',
				fontWeight: 100
			},
			{
				src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZhrib2Bg-4.ttf',
				fontWeight: 200
			},
			{
				src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf',
				fontWeight: 300
			},
			{
				src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
				fontWeight: 400
			},
			{
				src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf',
				fontWeight: 500
			},
			{
				src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
				fontWeight: 600
			},
			{
				src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
				fontWeight: 700
			},
			{
				src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf',
				fontWeight: 800
			},
			{
				src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf',
				fontWeight: 900
			}
		]
	},
	{
		family: 'Ubuntu',
		fonts: [
			{
				src: 'http://fonts.gstatic.com/s/ubuntu/v20/4iCv6KVjbNBYlgoC1CzTt2aMH4V_gg.ttf',
				fontWeight: 300
			},
			{
				src: 'https://fonts.gstatic.com/s/ubuntu/v20/4iCs6KVjbNBYlgo6eAT3v02QFg.ttf',
				fontWeight: 400
			},
			{
				src: 'https://fonts.gstatic.com/s/ubuntu/v20/4iCv6KVjbNBYlgoCjC3Tt2aMH4V_gg.ttf',
				fontWeight: 500
			},
			{
				src: 'https://fonts.gstatic.com/s/ubuntu/v20/4iCv6KVjbNBYlgoCxCvTt2aMH4V_gg.ttf',
				fontWeight: 700
			},
			{
				src: 'https://fonts.gstatic.com/s/ubuntu/v20/4iCp6KVjbNBYlgoKejZftWyIPYBvgpUI.ttf',
				fontWeight: 300,
				fontStyle: 'italic'
			},
			{
				src: 'https://fonts.gstatic.com/s/ubuntu/v20/4iCu6KVjbNBYlgoKeg7znUiAFpxm.ttf',
				fontWeight: 400,
				fontStyle: 'italic'
			},
			{
				src: 'https://fonts.gstatic.com/s/ubuntu/v20/4iCp6KVjbNBYlgoKejYHtGyIPYBvgpUI.ttf',
				fontWeight: 500,
				fontStyle: 'italic'
			},
			{
				src: 'https://fonts.gstatic.com/s/ubuntu/v20/4iCp6KVjbNBYlgoKejZPsmyIPYBvgpUI.ttf',
				fontWeight: 700,
				fontStyle: 'italic'
			}
		]
	}
];
```

- Шрифт можно искать в [гугле](https://fonts.google.com/), указав cyrillic в фильтре.
- Сслыка на шрифт не может быть локальной. Прямые ссылки добываются [здесь](https://developers.google.com/fonts/docs/developer_api?apix_params=%7B%22sort%22%3A%22ALPHA%22%7D&hl=ru) Нужно нажать справа на попробовать, ввести названия шрифта, найденного ранее. В полученном ответе будут нужные данные.
- Если не указывать шрифт, будет автоматически применен такой:

```js
const defaultFont = {
	family: 'Roboto',
	fonts: [
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf',
			fontWeight: 100
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf',
			fontWeight: 100,
			fontStyle: 'italic'
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf',
			fontWeight: 300
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf',
			fontWeight: 300,
			fontStyle: 'italic'
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
			fontWeight: 400
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf',
			fontWeight: 400,
			fontStyle: 'italic'
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf',
			fontWeight: 500
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf',
			fontWeight: 500,
			fontStyle: 'italic'
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf',
			fontWeight: 700
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf',
			fontWeight: 700,
			fontStyle: 'italic'
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf',
			fontWeight: 900
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf',
			fontWeight: 900,
			fontStyle: 'italic'
		}
	]
};
```

#### PdfTable v1.2.0

- В схему добавлена функция getValue. Работает как в Table.

## 2024-03-17 v1.0.0-beta14

### app

- Добавлен R.libs.indexedDb Здесь располагается библиотека для работы с Indexed DB, которую использует React-Query для оффлайн режима - [idb-keyval](https://github.com/jakearchibald/idb-keyval) Библиотека очень простая и легкая. Работает только по одному принципу - записывает/читает/удаляет ключ и его значение. Вот пример из Стартума для сохранения фото:

```js
const last = R.libs.just.last;
const { get, set, keys, delMany } = R.libs.indexedDb; // импортируем методы библиоткеи

const imageUrlToBase64 = async (url) => {
	// функция, которая скачивает картику по ссылке и преобразует ее в Data URL (base64)
	const response = await fetch(url);
	const blob = await response.blob();
	return new Promise((onSuccess, onError) => {
		try {
			const reader = new FileReader();
			reader.onload = function () {
				onSuccess(this.result);
			};
			reader.readAsDataURL(blob);
		} catch (e) {
			onError(e);
		}
	});
};

await Inputs.tasks?.map(async (i) => {
	await i['task-result']?.map(async (taskResult) => {
		// перебераем все задачи, где хранятся картинки. Каждая задача - отдельный ключ в Indexed DB.
		const storeKey = `images:${taskResult.id}`; // название ключа в Indexed DB
		if (taskResult.content?.images) {
			let newStore = [];
			const imagesStore = await get(storeKey); // качаем данные по ключу

			await Promise.all(
				taskResult.content.images // подготавливаем формат для записи в IDB, исключая уже имеющиеся записи
					.filter((i) => !imagesStore?.map((i) => i.id).includes(last(i.split('/')).split('.jpg')[0]))
					.map(async (i) => {
						const image = {
							id: last(i.split('/')).split('.jpg')[0],
							name: last(i.split('/')),
							contentType: 'image/jpeg',
							state: 'uploaded'
						};

						const imageBase64 = await imageUrlToBase64(i); // скачиваем картинку и преобразуем в base64
						image.data = imageBase64;
						newStore.push(image);
					})
			);

			imagesStore?.map((i) => {
				if (!newStore.map((i) => i.id).includes(i.id) && i.state !== 'atWebcam') newStore.push(i);
			});

			if (newStore.length) await set(storeKey, newStore); // записываем подготовленные данные в IDB
		}
	});
});

// чистка IDB
keys().then((ks) => {
	// берем все ключи IDB
	let toDeleteStoresKeys = [];

	ks.filter((i) => i.split(':')?.[0] === 'images').map((key) => {
		// берем только ключи, которые начинаются на images:
		const taskResultId = key.split(':')?.[1];
		const taskResultsIds = Inputs.tasks?.map((task) => task['task-result']?.map((i) => i.id)).flat();
		if (!taskResultsIds.includes(taskResultId)) toDeleteStoresKeys.push(key); // если в скаченных данных нет айдишников из IDB
	});

	delMany(toDeleteStoresKeys); // удаляем за раз все данные по названиям ключей
});
```

### data

- UseData - исправлен баг двойной первичной загрузки.
- Data - поправлена ошибка зависания при переходи из офлайн в онлайн. При переходе из офлайна в онлайн, если в кеше есть мутации, больше не происходит автобновление данных, т.к. мутация создает событие realtime.
- update - добавлена опция Optimistic. При включенной опции сразу обновляет кеш данных, не дожидаясь ответа бекенда. При этом данные на выходе всех UseData измененных классов обновятся, но не сработает триггер Fetched. Чтобы управлять таким сценарием, update при включенном Optimistic выдает сигнал Optimistic updated, с помощью которого можно тригернуть обновления данных в нужных местах. Когда нет сети опция Optimistic включается автоматически, т.к. только так можно записать данные без сети.
- update - добавлена опция silent: true/false в схему. Когда включена не генерирует realtime событие, а значит и автообновление данных. Нужно обновлять сервер.
- update - добавлена опция offlineSilent: true/false в схему. Когда включена не генерирует realtime событие, если в момент срабатывания приложение было не в сети. Нужно обновлять сервер.

## 2024-03-13 v1.0.0-beta13

### data

- dataOld больше не нужен.
- create - v0.4.0 переехал в новый RK. v1.0.0 - процесс создания по схеме переехал на сервер. Пример схемы:

```js
[
	{
		dbClass: 'worker',
		order: 0,
		items: [
			{
				company: { id: 'W5XSgIoBj2T-UFOWng5l' },
				content: { firstName: 'Тестовый', lastName: 'Аккаунт 6' },
				user: { id: 'kuid-noisy-minstrel-18541' },
				manager: { id: 'EW7HgIoBAb9VwPpXmhmn' }
			}
		]
	},
	{
		dbClass: 'task',
		order: 1,
		items: [{ content: { name: 'Тест' } }], // схема может иметь items и/или itemsFunc
		itemsFunc: `(items, data) => { // в items передается items этого же объекта строчкой выше. В data передается вся data c предидущих шагов как у UseData
            return items.map(i => ( // вернуть нужно items в том же формате, что и в ключе items. Они будут переданы в БД
                { ...i, worker: {id: data['worker'].items[0].id} }
            ))
        }`
	}
];
```

- update - v0.3.0 переехал в новый RK. v1.0.0 - процесс обновления по схеме переехал на сервер. Схема как у create, но в items должен быть id.
- delete - v0.3.0 переехал в новый RK. v1.0.0 - процесс удаления по схеме переехал на сервер. Схема осталась как у v0.4.0

## 2024-03-12 v1.0.0-beta12/pdf-table

### pdf

#### PdfTable v1.1.0

- Добавили возможность передавать стили через функцию.
- Добавили customProps и propsFunction

## 2024-03-11 v1.0.0-beta12

### data

- Не работали старые UseData.

## 2024-03-11 v1.0.0-beta11

### data

- Data - не верно включался offline режим.

## 2024-03-11 v1.0.0-beta10

### mantine

- NumberInput - добавлен выходной сигнал сброса.
- MaskedInput, TextInput, TextArea - добавлен входной порт Value для контроллируемого режима.

### data

- UseData, getData - больше не требуют добавлять выходных портов, если нужна только Data.
- В Data добавлена опция Persist data, которая включает сохранение данных в IndexedDB и их использование, если нет сети.
- Auth теперь сохраняет все данные авторизованного пользователя, а не только его роль.
- nodered - не запускался по сигналу.

### serviceWorker

- Нода, которая регистрирует Service worker. Чтобы корректно работала, нужно вставлять над App и иметь в корне проекта файл sw.js
- Живет в отдельном пакете, т.к. изменяет поведение всего приложения.

## 2024-03-07 v1.0.0-beta9

### mantine

- Select - исправлены ошибки в контроллируемом режиме.

### app, data, auth

- В App добавлен эксперементальный флаг для добавления Serivce worker. Файл service worker - sw.js, должен находиться в корне проекта.
- Data при включенном Serivce worker дожидается его активации и перезапускает приложение.
- Data научилась слушать состояние сети. При смене сети (online >> offline, wifi >> lte и т.д.) и включенном дебагере в консоле будет видно сообщение "Network status changed" с новым статусом сети. В R.states отображается статус online.
- Data передает на выход состояние online.
- Data сохраняет dbClasses в хранилище и использует их, если offline.
- Auth теперь понимает, что приложение может быть offline и больше не требует авторизации, не запускает ее регулярную проверку, если в хранилище уже есть ключ JWT и приложение offline.

## 2024-03-05 v1.0.0-beta8

### gantt

- Не подгружался CSS

## 2024-03-05 v1.0.0-beta7

### mantine

- TextInput и FormInput не сбрасывали значение крестиком в форме.
- DatePickerInput - лишний, не работающий порт Default date. Порт Date value дважды подавался на вход вместо того, чтобы подаваться на вход и на выход по разу.
- NumberInput - не устанавливал значение через порт в контроллируемом режиме.

### data

- Переведены ноды logout, nodered и saveAs на новый RK.
- xlsx вынесен в отдельный модуль.

### xlsx

- createXlsx переведен на новый RK.

## 2024-02-29 v1.0.0-beta6

### Mantine

- Переехали ноды:
  - NavLink.
  - Popover - поведение изменено, теперь работает как HoverCard, но с сигналами. Пример в Стартуме.
- SegmentedControl не выводил на выход дефолтное значение.
- UnstyledButton потерял customProps.
- Новая нода - HoverCard. Состоит из 3-х нод:
  - HoverCard - здесь задаются параметры, в том числе customProps, если нужно применить параметры компененты Mantine.
  - HoverCardTarget - нода-обертка для целевого элемента. Целевой элемент не может многокомпонентным. Обычно это картинка, иконка, текст.
  - HoverCardDropdown - нода-обертка для показываемого элемента. Оборачивается в Paper с тенью. Здесь можно располагать любые элементы.
- MaskedInput не проставлял дефолтное значение в форме.

### qrCode

- Ноды переехали из Mantine.

### gantt

- Добавлен customProps.

## 2024-02-29 v1.0.0-beta5

### Mantine

- Переехали ноды: Button (нужно проверять, что в disabled подается boolean), UnstyledButton, Box, Flex, Center, Paper.
- ActionIcon не простовлял дефолтный scope.

## 2024-02-29 v1.0.0-beta4

### Mantine

- Text и Title не форматировали дату.
- Select больше не подает сигнал reset, если подать пустой default item.
- MaskedInput больше не зацикливается в форме.

### Gantt

- Переехал в новый RK.

## 2024-02-27 v1.0.0-beta3

### Mantine

#### formDatePickerInput v1.0.0

- Исправлен баг зацикливания при работе с формой.

## 2024-02-27 v1.0.0-beta2

### Общие изменения

- Версия теперь ругается, когда не выбрана не только при добавлении ноды, но и при миграции на новый RK.

### Mantine

- Переехали все ноды Typography - Text, Title, List.

## 2024-02-25 v1.0.0-beta1

- Описание потеряно в крови и поту.

## 2024-01-09 v0.28.0

### Общие изменения

- RK переведен на [Turborepo](https://turbo.build/repo). Нужно для удобства разработки. Позволит более точно следовать принципу Monorepo.
- С этой версии начинаем вводить управление стилями глобально средствами Mantine. Для этого обновлена нода Mantine. Сходу вылезла проблема - у наших компонентов заданы дефолтные параметры, которые перезаписывают параметры, заданные в теме Mantine. Будем изменять поведение дефолтных настроек под этот сценарий. Подробнее в port-fabric.
- Чтобы перейти на эту версию нужно заменить App и Mantine новыми.

### Новые пакеты

#### node-fabric v0.2.0

- Внутренний пакет - не видно в папке RK.
- Раньше это был просто набор функций, который использовали другие пакеты. Выведен в пакет для удобство разработки RK.
- Порт Version перестал быть статичным - не нужно перезаходить в проект при обновлении RK.
- Все ноды могут загружаться как синхронно, так и асинхронно.
- Повышена безопастность:
  - Для всех видов нод - порты, которые настраиваются только в интерфейсе проверяются сразу и ругаются, если что не так.
  - Для JS-нод - пока не убраны предупреждения нода не запускает сигнал. Предупреждение появляется при запуске сигнала для портов, которые настроены на проверку по сигналу.
  - Для React-нод - раньше проверка происходила только после монтирования ноды, теперь порты, что настраиваются в интерфейсе проверяются сразу, остальные по старому - при монтировании.

#### port-fabric v0.6.0

- Внутренний пакет - не видно в папке RK.
- Как node-fabric первращен из набора функций в пакет.
- Пересобран способ организации портов. Теперь порты можно задавать как раньше из списка и вручную для редких портов. Это позволяет избежать проблем, когда нужно изменить праметры порта для новой версии ноды, не трогая старую.
- Подсказки теперь будут показывать внутренне название портов, чтобы было удобнее работать с Prop functions.
- Добавлена функция проверки завивимостей портов. Раньше один порт зависил от других по списку условий равенства, теперь функцией. Позволит создавать любые условия, а значит не будет лишних портов.
- Изменено поведение дефолтных значений портов:
  - У порта нет дефолтного значения - скрытый порт удаляется на уровне ноды.
  - У порта есть дефолтного значения. Управляется настройкой порта:
    - Для портов управляющими стилями Mantine - дефолтное значение берется из настроек темы проекта. Если нет значения, порт удаляется на уровне ноды. Скрытый порт удаляется на уровне ноды.
    - Для порта есть дефолтное значение, заданное в настройках проекта (пока только defaultDateFormat) - применяется это значение. Скрытый порт удаляется на уровне ноды.
- Изменено поведение обязательных портов. Такие порты теперь будут помечаться звездочкой. Порт может быть обязательным на уровне редактора параметров ноды и на уровне соединений.
  - Обязательный порт на уровне редактора параметров ноды ругается сразу после вставки и когда параметр пуст.
  - Обязательный порт на уровне соединения ругается при выполнении кода. Для JS-нод - по сигналу, для React-нод при монтировании.
  - Любой порт, имеющий дефотное значение и который можно подавать на любом уровне является обязательным для проверки на уровне сединения.

### Изменения нод

- [Image v0.4.0](https://kit.rolder.app/rk/ui/elements/dataDisplay/Image.html)
- [App v1.4.0](https://kit.rolder.app/rk/project/App.html)
- [Mantine v0.2.0](https://kit.rolder.app/rk/project/Mantine.html)

## 2023-12-31 v0.27.0

### Новый пакеты

#### pdf v0.1.0

- Состоит из набора нод для создания PDF и одной ноды для отображения.

#### qr-code v0.1.0

- Сейчас с одной нодой для получения QR, готового для вставки в Image.

### Новые ноды

#### PdfViewer v0.1.0

- Отображает одну страницу PDF за раз.
- На вход можно подать Blob или URL.
- Выдает количество странниц и текущую страницу.
- На вход можно подавать номер страниц, тем самым управляя навигацией по PDF.
- Задается ширина или высота. Если задать ширину, высота игнорируется.

#### PdfDocument v0.1.0

- Нода родитель для создания PDF-документа.
- [Настройки](https://react-pdf.org/components) задются через Custom props.
- Дочерней нодой может быть только PdfPage.
- Создание PDF запускается сигналом create. Создание выведено в сигнал, т.к. рендеринг PDF тяжелая опреация и нужно контролировать ее.
- На выходе выдает статус, сигнал завершения и blob, который можно подать в PdfViewer или сохранить с помощью saveAs.
- Процесс создания PDF большого объема нагружает проц пользователя, что блокирует интерфейс. Первый опыт показал - лучше не пытаться генерировать PDF больше 100 страниц.

#### PdfPage v0.1.0

- Страница PDF. Можно сказать, что это логическая странница, т.к. с дефолтными настройками библиотека сама разрезает содеражание на страницы.
- [Настройки](https://react-pdf.org/components) задются через Custom props.
- [Стили](https://react-pdf.org/styling) задаются в настройке Page styles.
- Дочерними нодами могут быть PdfView, PdfText или PdfImage. Можно использовать Repeater.

#### PdfView v0.1.0

- Эта нода организует пространство на стрнице. По сути это div. Макет организуется через классический CSS или FlexBox, смотри стили и пример в Клининге.
- [Настройки](https://react-pdf.org/components) задются через Custom props.
- [Стили](https://react-pdf.org/styling) задаются в настройке View styles.
- Дочерними нодами могут быть PdfView, PdfText или PdfImage. Можно использовать Repeater, но не проверено.

#### PdfText v0.1.0

- Текст. Сейчас используется один шрифт - Roboto.
- Text content - параметр для передачи текста.
- [Настройки](https://react-pdf.org/components) задются через Custom props.
- [Стили](https://react-pdf.org/styling) задаются в настройке Text styles.

#### PdfImage v0.1.0

- Картинка. Source работает как у обычного Image.
- [Настройки](https://react-pdf.org/components) задются через Custom props.
- [Стили](https://react-pdf.org/styling) задаются в настройке Image styles.

#### saveAs v0.1.0

- Преобразует Blob в File и передает его браузеру для сохранения.

#### List v0.1.0

- Отображает список с номерацией или "пулями".
- Можно заменять "пули" иконкой.
- Можно вкладывать один список в другой.
- Все параметры из [библиотеки](https://v6.mantine.dev/core/list/) реализованы.
- Поддерживает Prop function.
- Можно подать иконку для всего списка в параметрах. Можно указать для каждого элемента в схеме, эта иконка перезапишет иконку в параметрах.
- В схему можно подавать customProps.
- Пример схемы:

```js
[
	{
		string: 'First string',
		icon: {
			name: 'IconHome',
			type: 'themeIcon',
			themeIconProps: {
				size: 'sm',
				color: 'red',
				radius: 'md'
			},
			iconPprops: {
				size: '1rem'
			}
		}
	},
	{
		string: 'Second string',
		icon: {
			name: 'IconUser',
			iconPprops: {
				size: '1rem'
			}
		},
		customProps: { sx: { backgroundColor: '#555' } }
	}
];
```

- Тип данных схемы:

```ts
listScheme?: {
    string?: string
    icon?: {
        type?: 'icon' | 'themeIcon'
        name?: string
        iconProps?: {
            size?: MantineNumberSize
            color?:MantineColor
            stroke?: number
        }
        themIconProps?: {
            variant?: ThemeIconVariant
            size?: MantineNumberSize
            radius?: MantineNumberSize
            color?: MantineColor
            gradient?: MantineGradient
        }
    }
    customProps?: any
}[]
```

#### getQrCode v0.1.0

- Преобразует текст в QR.
- Выдает Data URL, который можно подавать в Image.

### Изменения нод

#### Table v2.1.1

- Исправлен баг - expander множился пачкованием.
- Больше не срабатывают тригер мульти-выбора при монтировании.

#### Image v0.3.0

- Добавлен контекст таблицы.
- Добавлен Prop function. Вторым параметром принимает item с таблицы.

#### Icon v0.5.0

- Теперь можно выбрать между простой иконкой и [Theme Icon](https://v6.mantine.dev/core/theme-icon/)
- Theme Icon - обертка для Icon. Позволяет задать цвет фона иконки, размер фона и т.д.
- Поправлен баг - цвет иконки не принимал формат Mantine.

## 2023-12-26 v0.26.0

### Общие изменения

- Закрыт костылем баг, из-за которого приложение вылетало после простоя и нового запроса с UseData, если открывать приложение без фокусировки (например, с включенными DetTools в браузере).

### Изменения нод

#### UseData v0.12.3

- Асинхронная загрузка ноды.
- Исправлен баг - не происходила переподписка при изменении параметров.
- Исправлен баг - не всегда срабатывала подписка, если использовать UseData как повторяемый элемент.
- Исправлен баг - отмена подписки не всегда верно отрабатывала.

#### Flex v0.1.0

- К вариантам для порта Justify добавлен Space between.

#### Select v0.6.0

- Добавлен Props function.
- Асинхронная загрузка ноды.
- Исправлен баг - нода не сбрасывала варианты выбора, если подавался пустой массив items на входе.

#### Grid v0.3.1

- Исправлен баг - не верно рендерился второй и последующие ряды.

## 2023-12-18 v0.25.0

### Утилиты

#### convertColor v0.2.0

Утилита конвертирует цвет формата Mantine с шейдом в стандартный хеш-формат. Нужна для компонентов не поддерживающих цвет Mantine. Или чтобы вытащить оттенок цвета в Noodl. Запускается просто convertColor.v2('red.6')

### Изменения нод

#### Table v2.1.0 `#experimental`

##### Доработки

- Любого вида ячейки обернуты в компонент Box. В схему добавлен параметр boxProps, которые передаются в этот компонент. Потребовалосm это для разворачиваемых таблиц. Дочерние таблицы наследуют какие то подкапотные стили, пока не пойму как с этим справится, Box это решает. В [документации](https://v6.mantine.dev/core/box/) написано,что можно использовать Box для sx-параметров, но по факту можно передавать и стандартные. Вот пример, создающий отступ первой ячейки у дочерней таблицы:

```js
[
	{
		accessor: 'content.name',
		expander: true,
		boxProps: { pl: 28 }
	}
];
```

- Добавлен параметр Height.

##### Исправленные баги

- Таблица умерала при первичном включении expander.
- При включенном expander, переносилась строка, если текст не входил.
- Лишний разделитель между строк при развертывании, когда он убран в настройках.
- Восстановлена потереня фича - задавать функцию render в схеме.

#### UseData v0.12.2

- Исправлен баг - текущая странница не сбрасывалась при поступлении новых данных.
- Исправлен баг - не верно работала пагинация, при перемотке обратно.

#### Icon v0.4.0

##### Доработки

- Добавлен возможность подключаться к контексу таблицы.
- Добавлен Props function. Второй параметр - item с таблицы.

##### Исправленные баги

- Цвет не поддерживал шейд. `#breakingChange` Параметр с установкой цвета был переименован.

#### DatePickerInput v0.3.0 `#breakingChange`

##### Доработки

- Нода пересобрана с 0, не совместима с прошлой версией.
- Добавлен Props function.
- Добавлена возможность подавать ошибку в контроллируемом режиме.
- Теперь подерживает 3 варианта поведения. В любом из них можно подавать значение на вход:
  - Default - одна дата. Формат даты - `JS Date`.
  - Range - период. Формат - `[JS Date | null, JS Date | null]`.
  - Multiple - несколько дат. Формат - `JS Date[]`.
- dateValue - значение выбранной даты или дат, которое можно подать на вход или получить на выходе.
- changed - сигнал изменения выбора. При типе Range или Multiple, сигнал подается при выборе каждой даты.
- reset - сигнал для сброса.
- reseted - сигнал сброса.

##### Исправленные баги

- Вместо компоненты Mantine DatePickerInput использовалась DateTimePicker.

### Новые ноды

#### Highlight v0.1.0

Подсвечивает выбранные слова в строке.

##### Параметры

- Основные параметры как у Text.
- Поддерживает Props function. Второй параметр - item.
- Highlight - массив слов для подсветки.
- Highlight Color - цвет подсветки.
- Highlight Styles - кастомный стиль подсветки. В [документации](https://v6.mantine.dev/core/highlight/#change-highlight-styles) хороший пример.

##### Пример стиля, выделяющего текст серым и убирающий дефолтный желтый фон

```js
[
	{
		color: 'gray',
		backgroundColor: 'transparent'
	}
];
```

##### Пример Props function, подающего переменное слово для подсветки

```js
[
	{
		h: (p, i) => ({ ...p, highlight: [i.tasksCount] })
	}
];
```

## 2023-12-17 v0.24.0

### Общие изменения

- Добавлен глобальный параметр Props function. У каждой ноды его нужно добавлять, пока есть у Text v0.6.0 Идея возникла из проблемы с таблицей. Проблема в том, что, когда начинаешь повторять компоненты (клонировать) на уровне React, это не синхронизируется на уровне Noodl. В результате, мы видим данные только последнего склонированного компонента React. Для таких сулчаев нашел решение - увести обработку на уровень ниже, т.е. в React. По сути это function Нудла, встроенный в ноду. Вот пример:

  ```js
  [
  	{
  		func(props, item) {
  			if (item?.states.flow.value === 'success') {
  				props.variant = 'gradient';
  				props.gradient = { from: 'green', to: 'indigo', deg: 45 };
  			} else {
  				props.color = item?.states.flow.color;
  			}
  			return props;
  		}
  	}
  ];
  ```

  Функция, меняющая цвет текста (пример с ноды Text) в зависимости от статуса. На входе всегда все props ноды, на выходе должны быть они же с нужными изменениями. Вторым параметром могут быть любые праметры, зависит от ноды применения. Есть свои особенности:

  - Параметр установлен глобально, но рабтать будет не у всех нод.
  - Ошибка в коде - нода не упадет, останутся оригинальные props. В консоле можно увидеть ошибку.
  - Поскольку ноды принимают помимо наших параметров и стандартные Мантиновские, то можно добавлять их в props.
  - Нужно знать внутренне название props. Смотреть нужно в коде конкретной ноды. Некоторые ноды строго типизированы, тогда удобней смотреть в types.d.ts в папке ноды.

### Изменения нод

#### Table v2.0.0 `#experimental`

- Проверяем гипотезу составной, модульной таблицы.
- Построена на библиотеке, с котороый мы начинали - <https://icflorescu.github.io/mantine-datatable-v6>
- Принцип модульности означает, что нет вариантов для группировки или иерархии. Таблица всегда просто таблица. Если нам нужна группировка или иерархия, мы организуем ее на уровне данных и собираем из модулей.
- Колонки:
  - Данные. Стандартная колонка, которая показывает текст без форматирования.
  - Чекбокс. Мультивыбор.
  - Expander. Колонка с шевроном. Шеврон можно сделать кликабельным.
- Модули.
  - ColumnCell. Кастомная ячейка для колонки.
  - ColumnFilter. Фильтр для колонки.
  - RowExpansion. Разворачиваемя строка.
- Порты:
  - Включение групп настроек. Настройки в группе переходят в свое дефолтное состояние, если группа не включена:
    - Single selection - одиночный выбор.
    - Multi selection - множественный выбор (чекбоксы).
    - Sort - сотировка.
    - Filter - фильтрация.
    - Expansion - разворачивание.
    - Layout - макет.
    - Dimensions - размеры.
    - Table styles - стили таблицы.
    - Row styles - стили строк.
  - Параметры:
    - Columns - схема колонок.
    - On row click - выбор поведения при нажатии на строку. Может быть: Disabled, Single selection, Expansion.
    - Column index (ноды ColumnCell и ColumnFilter) - индекс колонки, начиная с 0.
  - Данные:
    - Items - массив данных.
  - Выбор:
    - Одиночный:
      - Single selected item - выбранный item. На входе работает как способ установки выбранного item при первом показе таблицы или изменение выбора за пределами таблицы. На выход передает выбранный item или null при отмене.
      - Unselectable - отмена выбора.
      - Single selected - сигнал выбора.
      - Single unselected - сигнал отмены выбора.
      - Reset single selection - сброс выбора.
    - Множественный:
      - Multi selected items - выбранные items. Принцип как у single - можно подавать на вход и ловить на выходе. Ент выбора - на выход пустой массив.
      - Multi selection changed - сигнал смены множественного выбора.
      - Reset multi selection - сброс выбора.
  - Sort:
    - Type - фронт или бекенд сортировка.
    - Reset sort - сигнал сброса сортиовки.
    - Sorted icon - название иконки в активном состоянии. В customProps можно настроить детали.
    - Unsorted icon- название иконки в пассивном состоянии.
  - Filter:
    - Type - фронт или бекенд фильтрация.
    - Reset filters - сигнал сброса всех фильтров.
  - Filter (нода ColumnFilter):
    - Column index - индекс колонки.
    - Filter value - значение параметра фильтрации.
    - Set filter value - установить значение параметра фильтрации и состояния иконки.
    - Filter - сигнал зупуска фронт-фильтрации.
    - Close - сигнал, закрывающий Popover.
    - Reset - сигнал, сбрасывающий фильтр.
  - Expansion:
    - Allow multiple - разворачивать несколько строк.
    - Expanded items - items развернутых строк.
    - Expansion changed - сигнал изменения.
    - Expand all - развернуть все.
    - Unexpand all - свернуть все.
  - Макет:
    - No header - прячет заголовок.
  - Размеры:
    - Width - ширина.
    - Min height - минимальная допустимая высота.
    - Max height - максимальная допустимая высота.
    - Dynamic height - использовать подстраиваему высоту.
    - Viewport bottom offset - отступ в пикселях от нижней гранницы экрана для подстройки высоты таблицы.
    - Horizontal spacing - размер padding ячеек по горизонтали.
    - Vertical spacing - размер padding ячеек по вертикали.
    - Font size - размер шрифта.
  - Стиль таблицы:
    - With border - border таблицы.
    - Border radius - радиус таблицы.
    - With column borders - borders между колонками.
    - With row borders - borders между строками.
    - Shadow - тень таблицы.
    - Animation - анимация таблицы. Работает, когда выключен Expansion. `Важно` не использовать, если в таблицу подается больше 100 items, будут тормоза.
    - Loader color - цвет загрузчика. Подробные настройки в Custom props
  - Стиль строк:
    - Striped - чередование строк.
    - Even bg color - цвет нечетных строк.
    - Odd bg color - цвет четных строк.
    - Bg color - цвет строки.
    - Highlight on hover - подсвечивать при наведении.
    - On hover bg color - цвет при наведении.
    - Single selection bg color - цвет одиночного выделения.
    - Multi selection bg color - цвет множественного выделения.
  - Статусы:
    - Fetching - статус загрузки для loader.
  - Настройки Custom props:
    - scrollAreaProps - [параметры Scroll area](https://icflorescu.github.io/mantine-datatable-v6/examples/scrollable-vs-auto-height)
    - allRecordsSelectionCheckboxProps - [параметры чекбокса в заголовке](https://icflorescu.github.io/mantine-datatable-v6/examples/records-selection)
    - getRecordSelectionCheckboxProps - [параметры чекбокса строк](https://icflorescu.github.io/mantine-datatable-v6/examples/records-selection). Функция, можно менть настройки в зависимости от содержания item.
    - isRecordSelectable - [управление состоянием чекбокса строк](https://icflorescu.github.io/mantine-datatable-v6/examples/records-selection). Функция, которая должна вернуть true/false для включения/выключения чекбокса.
    - sortedIcon - настройки ионки в активном состоянии сортировки. Как в ноде Icon.
    - unsortedIcon - настройки ионки в пасивном состоянии сортировки.
    - loader - настройки загрузчика. Основной цвет указывается в настройках стиля таблицы, здесь детали. Смотри документацию Мантин. Пара наших примочек:
      - opacity - прозрачность фона.
      - bgColor - цвет фона.
      - bgBlur - блур фона.
    - collapseProps - [настройки](https://v6.mantine.dev/core/collapse/) анимации развертывания/сворачивания.
    - expander - настройки шеврона:
      - chevronIcon - настройки иконки шеврона. Как у ноды Icon.
      - actionIcon - настройки ActionIcon шеврона. Как у ноды ActionIcon.
- Инструкции:

  - Форматирование данных:

    - Когда ячейка простой текст, но нужно выдать его в определенном формате, ColumnCell становится излишним.
    - Форматирование делается самостояетльно с помощью библиотек и утилит, имеющихся в RK. Смотри R.libs и R.utils.
    - Нужно указать в схеме функцию - render(item) {...; return item}
    - Пример:

    ```js
    [
    	{
    		accessor: '#',
    		title: 'Имя',
    		render(item) {
    			const { capitalize } = R.libs.just;
    			const { getValue } = R.utils;
    			return capitalize(getValue.v8(item, '{{content.firstName}} {{content.lastName}}'));
    		}
    	}
    ];
    ```

  - Кастомная ячейка:
    - Есть 2 режима работы - не контролируемый и контролируемый.
      - Не контролируемый.
        - Предпочтительный режим, т.к. быстрый и легкий в использовании. Внешне таблица ведет себя нативно.
        - Ноды, которые не используют данные таблицы могут быть любыми.
        - Ноды берущие данные должны поддерживать контекст таблицы.
        - Ноды, которые должны уметь изменять свои настройки в зависимости от данных, должны поддерживать контекст и Props function.
        - Сейчас сделаны ноды Text v0.6.0 и Badge v0.3.0 Доработка типизирована, можно достаточно быстро накидать нод.
        - Нельзя вставлять реакции, действия и т.д, т.к. нет возможности вытащить на уровень Noodl текущий item.
      - Контролируемый.
        - Медленный, но и самый гибкий.
        - В основе лежит Repeater Noodl-а, а значит можно делать все, что можно делать в Repeater.
        - Repeater штука специфичная, при первой загрузке дает лаг в пол секунды, потом работает вполне быстро.
    - Дабы меньше использовать тяжелый контроллируемый режим, придумал новую фичу для нод - Props function. В начале пример и в Playground.
    - Инструкция:
      - Вставить дочерней нодой ColumnCell.
      - Указать Column index.
      - Выбрать режим работы:
        - Не контролируемый, Controlled = false:
          - Вставить любые ноды.
          - Добавить ноду, которая будет отображать данные, выбрать в ней источником данных таблицу, прописать путь к данным.
          - Ипсользовать Props function, если нужно менять свойства ноды.
        - Контролируемый, Controlled = true:
          - Вставить в ColumnCell Repeater и подать в него теже items, что и в таблицу.
          - В Repeater добавить шаблон, который и будет кастомной ячейкой.
          - В шаблоне получить текущий item через Object или скриптом. Пойти покурить, обудмывая, что же теперь делать с такими большими возможностями.
  - Сотрировка:

    - Пока не включена, праметры схемы игнорируются.
    - В параметрах нужно выбрать тип.
    - Схема сортировки задается для каждой колонки с помощью ключа 'sort'. Наличие ключа включает сортировку.
    - Бекенд:
      - Таблица никогда не сортирует данные.
      - В схеме `sort: {default: 'asc' или 'desc'}` - дефолтное направление сортировки. Может быть только у одной колонки, таблица возьмет из первой, если несколько. Устанавливаем тогда, когда из бекенда приходят уже первично отсоритрованные данные. Если ничего не отсортировано изначально, не устанавливаем.
      - `sort: true` для остальных колонок.
      - При изменении сортировки подаст Sort value - текущий параметр сортировки в формате UseData. Этот параметр можно передать прямо в UseData или изменить его как нужно. UseData тригернется, обновит items.
      - Reset sort - сбросит Sort value в null и сбросит состояние иконки. Соотвественно, нужно сначала сбросить UseData до первичного состояния.
    - Фронт:

      - Таблица сама сортирует данные.
      - Default - как у бекенда, но отсортирует первичные данные.
      - В схему сортировки нужно добавить ключ-функцию - 'func'. Этой функцией таблица будет сортировать данные. Функция должна возвращать отсортированные items. Принимает 2 параметра - items и direction. Таблица в оба параметра передаст данные. Для удобства есть [библиотека](https://www.npmjs.com/package/fast-sort). Пример с использованием библиотеки:

        ```js
        [
        	{
        		accessor: 'content.name',
        		title: 'Название',
        		sort: {
        			default: 'asc', // отсоритрует в направлении asc по content.name и повернет икноку при первичном показе
        			func(items, direction) {
        				// название переменных не имеет значение
        				return R.libs.sort(items).by([
        					// R.libs.sort - библиотека
        					{ [direction]: (i) => i.content.name }, // i.content.name - данные, по которым сортируем
        					{ desc: (i) => i.content.date.start } // можно добавлять что то свое, например когда на все есть стандартная сортировка, а пользователь сортирует поверх
        				]);
        			}
        		}
        	}
        ];
        ```

      - Как и с бекендом выдаст значение сортировки, но подавать его в UseData не нужно. Т.к. ключем сортировки является accessor из схемы, мы точно знаем что было отсортировано. Это можно использовать в каких то сценариях.
      - Reset sort - сбросит Sort value в null, сбросит состояние иконки и покажет items в том порядке, как они поданы в таблицу.

  - Фильтрация:

    - Пока не включена, праметры схемы игнорируются.
    - В параметрах нужно выбрать тип.
    - ColumnFilter. На каждую колонку добавляется свой ColumnFilter. Служит двум целям - хранит данные для выбранного значения фильтра и подает дочернюю ноду-фильтр в Popover в заголовке таблицы, подсвечивая иконку, когда есть значение в фильтре. Настройка:
      - Указать индекс колонки.
      - Добавить ноды в ColumnFilter. ColumnFilter с точки зрения верстки работает как div, который вставляется в Popover.
      - Связать ноду-фильтр с Filter value в ColumnFilter, и наоброт от ColumnFilter к ноде фильтру. Popover сбрасывает все при закрытии, это помогает восстановить выбранный пользователем фильтр.
      - Сигнал Close закрывает Popover.
    - Отличие работы бекенд и фронт вариантов сводится к вызову разных сигналов в ColumnFilter. При фронте фильтрация запускается сигналом Filter. При бекенде нужно использовать Set filter value для установки состояния иконки, а сама фильтрация производится в UseData.
    - Вариантов фильтрации много. В Playground показаны два примера. Один - простой, с Select, фильтрация вызывается сразу по выбору. Второй - сложнее, MultiSelect, сначала запоминаются выбранные позиции, а фильтрация запускается кнопкой в фильтре.
    - Бекенд:
      - Нода фильтр должна заканчивать свою работу сигналом Set filter value в ColumnFilter. Этот сигнал установит состояние иконки, но не будет фильтровать.
      - Преобразовать данные работы фильтра в Filters для UseData и передать в нее. UseData вернет новые данные, таблица обновится, сохранив статусы иконок.
      - Reset - сбросит Filter value в null, сбросит состояние иконки. Соответсвенно, нужно сбросить Filters в UseData.
    - Фронт:

      - Связать выходной сигнал ноды-фильтра с входным сигналом 'Filter' в ColumnFilter.
      - Настройка схемы. Для колонки с тем же индексом нужно указать ключ-функцию 'filterFunc'. Возвращаемые items должны сохранять свою структуру. Результат может быть пустым массивом. Принимает 2 параметра - items и filterValue. Таблица возьмет текущиие items, поданный filterValue и передаст в функцию. В утилитах (R.utils) есть filterBy, может облегчить задачу. Пример:

        ```js
        [
        	{
        		accessor: 'content.name',
        		title: 'Название',
        		filter: {
        			func(items) {
        				// название переменной не имеет значение
        				return items.filter((i) => i.state.flow.value === 'active');
        			}
        		}
        	}
        ];
        ```

      - Когда сработает сигнал Filter, таблица запустит не только фильтр, который тригернул сигнал, но и все остальные фильтры в схеме. Так они совмещаются между собой.
      - Reset - сбросит Filter value в null, сбросит состояние иконки и запустит фильтрацию для оставшихся включенных фильтров.

  - Разворачивание:
    - Пока не включено, праметры схемы игнорируются.
    - Добавить ExpansionRow. Может быть одна на таблицу. Используется первая, если вставлено несколько.
    - Ноды вставляются как у контролируемой ColumnCell.
    - Разворачивать можно двумя способами:
      - По нажатию на строку. Настройка On row click = Expansion. Шеврон - иконка.
      - По нажатию на шеврон. Настройка - в схеме `expander: true`. Шеврон - ActionIcon

- Известные ограничения:
  - ColumnCell:
    - При разработке динамически меняется только одна из строк.
    - При бекенд-сортировке, при сбросе слетают контролируемые ячейки.
  - ColumnFilter. При сбросе всей фильтрации, ColumnFilter не сбрасывает сохраненное значени.
  - Нельзя совмещать бекенд и фронт. Либо все бекенд, либо все фронт.
  - Сортировка:
    - Сортирует только по одной колонке.
    - Анимация уменьшаяет ширину колонок, если она не указана в схеме. Без анимации моргают кастомные ячейки.
  - Фильтрация:
    - Анимация при уменьшении кол-ва строк не самая красивая.
  - Развоваричвание. Анимация отключена - глючит при сворачивании.

#### Select v0.5.1

- Поправлено некоректное повдение - ноды вызывала сигнал выбора при первом открытии в ручном режиме.
- Нода выдавала item и сигнал одновременно. Теперь всегда саначала item, потом сигнал.

#### MultiSelect v0.3.0

- Нода пересобрана в такой же манере как и Select - внутри это отдельные компоненты для вариантов с формой и без.
- Добавлена возможность подавать ошибку в ручном режиме.
- Добавлен параметр цвета выделеных элеменотво в dropdown.
- Добавле выходной сигнал при сбросе.
- Добавлен выходной сигнал, когда нода закрывается.
- Нода выдавала item и сигнал одновременно. Теперь всегда саначала item, потом сигнал.
- Нода не отрабатывала Default items.

#### Text v0.6.0

- Props ноды типизированы.
- Добавлен возможность подключаться к контексу таблицы.
- Добавлена Props function. Вторым параметром передается item как поданный через инпут, так и через контекст.

#### Badge v0.3.0

- Props ноды типизированы.
- Добавлен возможность подключаться к контексу таблицы.
- Добавлена Props function. Вторым параметром передается item поданный через контекст.

#### ActionIcon v0.3.1

- Добавлен stopPropagation(), чтобы нажатие срабатывало только на иконку.

#### UseData v0.12.1

- Исправлен баг - не отображались уже загруженные данные при повторном монтировании.
- Исправлен баг - не рабтала подписка на обновления.
- Исправлен баг - не рабтал поиск, если не установлен фильтр.

## 2023-12-04 v0.23.0

### Общие изменения

- Все пакеты теперь формируют название файла из хеш-суммы кода. При каждом изменении разный хеш, разное название файла, а значит должна решитсья проблема, при которой браузер не хочет обновлять приложения до новой версии.
- `#experimental` Проверяем новую гипотезу работы с данными. На этот раз за основу взят принцип [KISS](<https://ru.wikipedia.org/wiki/KISS_(%D0%BF%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF)>) или по Щедровицкому - строгое функциональное разделение. Возможно будет перекос в сложность, но нам нужно туда сходить, чтобы найти золотую середину. Новый подход будет состоять из таких нод:
  - DataContext - объединяет данные в единный контекст. Хранит выделенный кеш данных. Используется для построения связей.
  - UseData - запрашивает данные для одного класса. Подписывается на изменения БД. Строит связи. Поиск. Может работать самостоятельно без контекста, если не нужны связи.
  - CRUD ноды - ноды изменяющие данные в БД. Вызывают события подписки в UseData, обновляя тем самым данные приложения. Не требуют обновления для работы в новом походе.

### Новые ноды

#### DataContext v0.1.0 `#experimental`

- Нода-контекст. Этой нодой мы организуем набор данных под конкретный сценарий. В сложных случаях, когда нужно организовать данные одних и тех же классов по разному, именно эта нода проводит границу между наборами данных. Нужна для работы UseData, если UseData несколько и есть связи.
- Использует [портал](https://legacy.reactjs.org/docs/portals.html), чтобы не мешать верстке. Это означает так же, что дочерними элементами могут быть только UseData. Пока замечено только одно исключение, когда верстка плывет при вставленном DataContext - Grid.
- На выход подает агрегированное состояние загрузки: если хоть одна UseData загружается fetching = true, иначе fetching = false и срабатывает сигнал fetched.

#### Gantt v0.1.0 `#experimental`

- Живет в отдельном пакете - Gantt.
- Для работы в папке проекта, в модулe gantt нужно найти css-файл, положить его в корень проекта под названием gantt.css и нужно добавть в head

```html
<link rel="stylesheet" href="gantt.css" />
```

- Принцип работы - всю работу с данными мы делаем за рамками ноды. По шагам:
  - Подаем tasks на вход.
  - Пользователь меняет один task. На выходе срабатывает сигнал taskChanged и подается changedTask.
  - Делаем нужные преобразования - меняем нужный проект, изменяем зависимые tasks, что-то еще.
  - Подаем измененные tasks на вход.
- Task имеет три типа
  - Задача (task) - сама задача, которую пользователь перетаскивает, растягивает.
  - Проект (project) - объединяет несколько задач. При изменении задач нужно пересчитывать и проект.
  - Веха (milestone) - задача без длительности. Как и задачу, пользователь может ее перетаскивать.
- Формат task:

```ts
interface Task {
	id: string;
	type: TaskType; // "task" | "milestone" | "project"
	name: string;
	start: Date;
	end: Date;
	progress: number; // от 0 до 100
	styles?: {
		backgroundColor?: string;
		backgroundSelectedColor?: string;
		progressColor?: string;
		progressSelectedColor?: string;
	};
	isDisabled?: boolean;
	project?: string;
	dependencies?: string[];
	hideChildren?: boolean;
	displayOrder?: number;
}
```

- Порты:
  - На вход
    - Tasks - массив задач для отрисовки. Формат строгий, задан библиотекой.
  - На выход
    - selected и selectedTask - сиганл выбор и выбранная задача. Можно удалять выбранный с клавиатуры.
    - taskChanged и changedTask - сигнал и измененная задача. Формат измененной задачи дополняется не только изменениями, но и внутрениими параметрами.
    - expandChanged и changedTask - сигнал и проект о том что он был свернут/развернут. changedTask при этом сигнале меняет внутри поле hideChildren. Соответсвенно, его просто нужно подменить в массиве задач.
    - taskDeleted и deletedTask - сигнал удаления и удаленная задача.
    - taskProgressChanged и changedTask - сигнал изменения % выполнения и измененная задача.
    - doubleClicked - сигнал двойного клика по задаче.
  - customProps - нода принимает customProps. Документация - <https://github.com/MaTeMaTuK/gantt-task-react>

### Изменения нод

#### UseData v0.12.0 `#experimental`

- Что умеет:
  - Загржуать данные одного класса при каждом изменении входных параметров.
  - Обновлять данные по подписке на изменения в БД.
  - Проставлять связи, если находится в контексте.
  - Добавлять в фильтр поисковые праметры, преобразуя простой запрос в поисковый.
  - Перемещаться вперед и назад по странницам.
  - Подгружать данные пользователя.
  - Транслировать статусы загрузки.
  - Делать агрегированные запросы.
  - Выдовать null вместо React-компоненты, чтобы не мешать верстке.
- Что не умеет:
  - Не может переходить на конкретную странницу.
- Работает в двух режимах:
  - Автономно. Не проставляет связи.
  - В контексте. Просталвяет связи по параметрам. Включается, когда является дочерним элементом DataContext.
- Поиск. Поиск теперь рабтает только для одного класса. Если нужно искать по нескольким классам, то нужно запускать поиск в соответсвующих нескольких UseData. Поисковой запрос как и обычный проставляет связи, если UseData в контексте. Поисковой запрос от обычного отличается только дополнительным фильтром по тексту, в остальном все правила его работы такие же. Задержку нужно делать в TextInput.
- Агрегация. Чтобы бекенд подсчитал какие-то данные нужно подать на вход в Aggregations соответсвующий запрос в формате Elasticsearch. Kuzzle сначал отфильтрует данные по параметрам в filters, а потом сделает расчеты агрегации. Результат будет выдан на выход Aggregations в виде объекта, где каждый ключ - это название бакета, а значение - результаты расчетов. Обычно, делая агрегацию, нам не нужны сами данные, тогда size нужно выставить в 0. При таком варианте запроса агреагция выполнится очень быстро дяже для большого объема данных. В Клининге, Планирование, Загрженность персонала есть пример использования.
- Пагинация. В Elasticsearch все не просто с пагинацией. Из коробки он позволяет делать только переход по странницам вперед. Это подходит для сценария бесконечного скрола, но не подходит для классической пагинации. Удалось сделать так, что переключать странницы можно и назад. Не удалось сделать переход к конкретной страннице, т.е. нельзя находясь не 2-й страннице перейти к 10-й, только к 3-й или 1-й. На входе есть два сигнала Next и Previous - следующая и предыдущая странница. Любое изменение параметров сбросит пагинацию на первую странницу. Пагинация работает как для обычного запроса, так и для поискового.
- Порты:
  - Входные:
    - Db class - класс БД. Берет в конфиге Kuzzle.
    - Filters - фильтрация на уровне БД.
    - Sorts - сортировки на уровне БД.
    - Size - ограничение загружаемого количетсва items на один запрос.
    - Referances - прямые связи с другими класами соседних UseData в одном контексте.
    - Back referances - обратные связи с другими класами соседних UseData в одном контексте.
    - Search fields - массив полей, в которых нужно искать.
    - Search string - поисковой текст. Задержку нужно организовывать самостоятельно.
    - Next - сигнал для загрузки следующей странницы.
    - Previous - сигнал для загрузки предыдущей странницы.
    - Get users - загружать данные пользователя. В маппинге должна быть связь с системным классом user.
    - Aggregations - запрос для [агрегации](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html) данных.
  - Выходные:
    - Items - загруженные данные.
    - Aggregations - результат агрегации данных.
    - Fetching - статус загрузки.
    - Fetched - сигнал загрузки.
    - Page - текущая странница, начиная с 1.
    - Fetched count - загружено items в текущем запросе.
    - Total count - всего записей в БД по текущему фильтру.

#### Checkbox v0.2.0

- `#breakingChange` Сигнал selected заменен на changed.
- Дабавлен статус checked.

#### Textarea v0.3.0

- Добавлен сигнал reset на вход и reseted на выход.

#### ScrollArea v0.3.0

- Добавлена возможность скролить к позиции:
  - Сигнал scroll запускает. Обычно хочется запустить скрол при изменении количества элементов в списке. Логично запускать его по сигналу fetched UseData. Это не сработает, т.к. скролу нужно время, чтобы вычислить новую высоту. Добавляем delay в 100мс между fetched и scroll.
  - scrollToMultiplier - множитель для расчета высоты куда скролить. 1 - самый низ, 0 - самый верх, 0.5 - середина.
  - scrollBehavior - smooth - красиво, instant - мгновенно без анимации, auto - не проверял, скорее всего instant, если в операционной системе отключена анимация, иначе smooth.

### Обновления библиотек

- jotai 2.5.1 > 2.6.0
- @tabler/icons-react 2.40.0 > 2.42.0

## 2023-11-20 v0.22.0

### Новые ноды

#### Checkbox v0.1.0

- Умеет работать с формой. Можно сбрасывать.
- Не умеет принимать состояние извне.

#### NumberInput v0.1.0

- Помимо стандартных функций умеет увеличивать/уменьшать значение по сигналам.

### Изменения нод

#### Badge v0.2.0

- Нода переведена на новый формат.
- Добавлены варианты Dot и Gradient. Для Gradient добавлен соответсвующий праметр. Со временем прикрутим его и к другим нодам - Button, Text и т.д. Красивая штука )
- Добавлен параметр fullWidth.

#### Grid v0.3.0

- Решена проблема взаимодействия с Repeater Noodl. Оказалось Repeater подает сначала себя в компоненту, а потом своих детей, оставляя себя в массиве на первом месте. Из-за этого Grid работал странно. Для решения проблемы добавлена опция childIsRepeater. Когда она включена, нода удаляет из массива Repeater, оставляя только его детей.
- Изменено поведение на более понятное. Если в Grid подан не массив, то он отрисовывает такую дочернюю ноду в первой колонке своей схемы. Раньше это выдавало ошибку или пустоту. Иными словами, теперь не нужно париться, что подавать в Grid, кроме случая с Repeater.
- Если решение хорошо себя зарекомендует, можно будет применить его и к другим подобным нодам - Stack, Group, Flex.

#### Table v1.5.0

- Добавлена возможность отображать иконки в несгруппированных ячейках для сгруппированног варианта таблицы.

  - Можно подавать одну кионку или несколько.
  - Если подать пустое имя, иконка не отрисуется.
  - Доступен выбор иконки по имени, рзамер, stroke и color.
  - Пример:

    - Одна иконка:

      ```js
      render: (row) => {
          return {
              comp: 'Icon',
              props: {
                      name: row.original.content.schedule.type === 'single' ? 'IconSquareNumber1' : 'IconRepeat',
                      size: 20,
                  }
          }
      },
      ```

    - Несколько иконок:

      ```js
      render: (row) => {
          return {
              comp: 'Icons',
              props: [
                  {
                      name: row.original.content.schedule.type === 'single'
                          ? 'IconSquareNumber1' : 'IconRepeat',
                      size: 20,
                  },
                  {
                      name: 'IconUrgent',
                      size: 20,
                      color: row.original.content.schedule.urgent ? 'red' : 'gray'
                  }
              ]
          }
      },
      ```

## 2023-11-14 v0.21.0

### Изменения нод

#### Table v1.4.0

- Добавлен выбор агрегированной строки.
  - Требования: сгруппированные объекты должны иметь id.
  - Параметры:
    - groupedRowSelectable - включение выбора агрегированной строки. Доступен, если expandOn = Icon.
    - groupedRowUnselectable - включение возможности отмены выбора агрегированной строки.
    - groupedRowSelected - сигнал выбора.
    - selectedGroupedItem - выбранный item.
    - resetGroupedRowSelection - сигнал сброса выбранной строки.
    - highlightSelectedGroupedRow - подсвечивать выбранную строку.
    - selectedGroupedRowColor - цвет подсветки.
- `#breakingChange` Изменен входной статус refreshing вместо searching, т.к. используется не только для поиска.
- `#breakingChange` Переименован параметр expendOn на expandOn.
- Поправленные баги:
  - Первый столбец при группировке не принимали параметр size.
- Ограничения: агрегированные ячейки не умеют принимать параметры cell. Костыль: подбираем размер для первого столбца. Текст, что не влазеет будет обрезаться.

## 2023-11-14 v0.20.0

### Общие изменения

- Разделение Mantine и React Query. Раньше эти библиотеки настраивались в App. Пришло время разложить все по полочкам. Теперь будет работать так:
  - App остается как контейнер для настроек проекта. Как и раньше - это самая верхняя нода в иерархии.
  - Data - новая нода. Опциональна, можно не использовать в редких случаях, когда весь бекенд Kuzzle не нужен. Держит в себе настройки Kuzzle. Подключается к Kuzzle, импортирует из него настройки классов. Поддерживает соединение с Kuzzle и сессию пользователя (авторизация). Идет вторым уровнем в иерархии.
  - Mantine - новая нода. Задает контекст для всех нод Mantine. Держит в себе настройки для Mantine. Идет третьим уровнем в иерархии.
- Вводим два новых тега:
  - #deprecated - так будем помечать ноды, порты, настройки, которые планируем выводить из использования.
  - #breakingChange - так будем помечать ноды, порты, настройки, изменение которых не соввместимо с предыдущей реализацией.
  - #experimental - подразумевает, что это всегда еще и breakingChange.
- Схема классов в БД. Потребовалась для миграции классов, когда нужно поменять маппинг не трогая старые данные. Оказалось удобно и для Rolder Kit. Пока нужна только для UseData v0.11.0. Для использования нужно завести БД (index) с названием "config" и класс с названием "dbclass_v1". Пока вот такой простой меппинг:

```json
{
	"dynamic": "false",
	"properties": {
		"name": {
			"type": "keyword"
		},
		"version": {
			"type": "short"
		}
	}
}
```

Так же нужно добавить этот класс в профиль безопасности на чтение, если применяется. Каждый класс должен иметь соотвествующую запись в этом классе.

- Production клиниг развернут на Yandex. Готовимся к Noodle open source. При этом возникло новое требование - в настрйоках проекта URL path type должен быть hash. Последние версии Rolder Kit не имеют с этим проблем.

### Новые ноды

#### Mantine v0.1.0 `#experimental`

- Сюда из App переехало:
  - Настрокйи темы.
  - Настройки дат.
  - Настройки сообщений.

#### Data v0.1.0 `#experimental`

- Сюда из App переехало:
  - Подключение к Kuzzle
  - Сессия пользователя
  - React Query.

#### nodered v0.1.0

- Нода для запуска flow Nodered. В каждом проекте могут быть разные flow. Частый пример - загрузка фото.
- Заменяет не настраиваемую ноду uploadWebCamShots. Практика показала - пытаться загружать в S3 файлы прямо с фронта плохая идея.
- Проверена на 2-х сценариях - загрузка файлов с компа, загрузка фото с вебкамеры.
- Работает так:

  - Нужно иметь flow в Nodered и знать название его endpoint.
  - Стандарт принимаемых данных такой, на примере:

    ```js
    Outputs.flowData = {
        params: { folder: `task/${Inputs.selectedTaskId}/${Inputs.selectedTaskResultId}` }, // параметры специфичные для каждого flow
        data: {somedata: []} // здесь могут быть любые данные кроме бинарных. Формат должен быть объектом или массивом.
        files: images.map(i => dataURItoFile(i.data?.data, i.data.name)) // Массив файлов. Формат именно File (смотри js new File). В файле должны быть: name, size и mimetype.
    }
    ```

#### DropZone v0.1.0 by Мишаня

- **Основные входы**

  - **File** - можно выбрать из папки, нажав на DropZone, либо перетащить файл в неё.
    - Принимает один файл выбранного типа, не позволяя вставлять иного типа.
    - Тип файла задается в виде 'pdf', 'excel', 'image'.
    - Принимает на вход согласно им:
      - pdf: .pdf
      - excel: .xls, .xlsx, .ods
      - image: все форматы картинок
    - Если ничего не задано, то принимет все файлы.
  - **Accept Icon Name, Reject Icon Name, Neutral Icon Name** - названия иконок, если тип файла подходит, не подходит и нейтральное состояние.
  - DropZone title - текст внутри DropZone. В при использовании в него можно вставлять строку, с названием файла на подобии: "Выбран файл: file1.pdf"

- **Основные выходы**:
  - **File** - файл в формате blob.
  - **File name** - название файла.
  - **Loaded** - сигнал, что файл принят.
  - **Rejected** - сигнал, что файл не верного типа.

### Изменения нод

#### App v1.3.0 `#experimental`

- Отчистка от Mantine и React Query.
- Убрана инициализация Kuzzle и поддержка сессии пользователя.
- Анимация инициализации теперь (снова) не испозьзует Mantine. Используется библиотека react-spinners, которую мы уже используем для BarLoader.
- Defaults теперь указываются здесь.
- breakingChange:
  - Перестанут работать UseData до версии 0.10.0 включительно.
  - Перестанут работать все настройки проекта кроме названия и версии проекта.

#### UseData v0.11.0 `#experimental`

- Еще одна попытка найти оптимальное решение. На этот раз выяснилось, что 2 UseData рядом с одним классом не уживаются, а сценарий такой есть.
- Как это работает:
  - Версия dbClass берется из БД. Нужно добавлять класс в Kuzzle - config >> dbclass_v1
  - Данные теперь выдаются по несколько классов. Одна UseData - несколько классов. При добавлении класса в схему, он появляется в виде нового выхода из ноды.
  - Связи простриваются только внутри одной UseData.
  - Данные всегда локальны. Это означает, что можно распологать рядом несколько UseData с одними и теми же классами - они никак не будут пересикаться.
  - Данные загружаются асинхронно. Указываем несколько классов - все они будут загружаться одновременно. Свзяи сами проставятся, когда будет возможно. Нужно иметь ввиду, что на выход сначала выдается набор items без связей, а потом еще раз со свзязми в том, случае, если при первой попыткиа проставить связи, свзываемые данные еще не загрузились.
  - При любом изменении схемы - данные перезагружаются. Так можно делать серверные фильтры - передавая новую схему по потребности.
  - Поиск работает синхронно. Учитывает параметры схемы - фильтры, сортировки, getUsers, sendStates, связи. Тут важно понимать общий принцип. Если мы указали 2 или больше классов, в каждом указали поисковые поля и связи, поиск будет это учитывать. Т.е. если поиск нашел данные в одном классе и этот класс ссылается на другой, то поиск выдаст совпадения и для связанного класса.
  - Поиск не делает задержку. Нужно выставлять ее в TextInput.
  - При работе со схемой, важно учитывать, как в ней исполняется код. Поскольку на основе схемы в ноду добавляются выходные порты, код в ней выполняется 2 раза:
    - При регистрации ноды. Нода еще не примонтирована, она вообще на другом экране, но код уже исполняется один раз.
    - Нода примонтирована - запускаетсявторое исполнение кода схемы и сама нода начинает тянуть данные по ней.
  - Отсюда вывод - если в коде есть данные, которые появляются не сразу, их нужно экранировать улсовием (?), как в примере ниже с R.user?.company.id
  - Статусы ноды меняет только какой то один выбранный класс. Загружаем мы много классов, но сатус пока умеет работать только по одному. Обычно этого достаточно, т.к. почти всегда нам нужен основной класс и несколько, связанных с ним.
- Пример схемы, где есть почти весь набор параметров:

```js
[
	{
		dbClass: 'company',
		options: { size: 100 },
		searchFields: [
			'content.name.search',
			'content.contacts.phone.search',
			'content.contacts.email.search',
			'content.legal.name.search',
			'content.legal.address.search'
		]
	},
	{
		dbClass: 'manager',
		query: {
			and: [{ not: { equals: { 'states.archived': true } } }, { equals: { 'company.id': R.user?.company.id } }]
		},
		sort: { '_kuzzle_info.createdAt': 'desc' },
		searchFields: ['content.firstName.search', 'content.lastName.search'],
		options: { size: 100 },
		refs: ['company'],
		getUsers: true,
		sendStates: true
	}
];
```

Замечания по схеме:

- dbClass - всегда без версии. Единственный обязательный параметр.
- query - фильтрация.
- sort - сортировки. Может быть несколько пар ключ-значение. Сортирует по заданному порядку.
- options - опции. На практике используем только size. Важно, если не указывать size, будет выдавать дефолтное количестов - 10.
- refs - выставлять связи. Не может выставить связь с классом, которого нет в схеме.
- backRefs - обратные связи. В этом примере можно было бы указать у company backRefs = ['manager']. Тогда каждый объект company проставил бы себе всех менеджеров, ссылающихся на него.
- searchFields - поля для поисковых запросов. Если не указано, данный класс не будет участовать в поиске.
- getUsers - если класс имеет ссылку ня системного пользователя, он будет подгружен. Важно учитывать - в три раза медленнее, т.к. вместо одного запроса будет 3.
- sendStates - указывает, что этот класс будет менять статус загрузки.
- //// Важно делать mount, если подаем схему снаружи.

#### Table v1.3.1

- Поправлен баг - при прокрутке исчезал разделитель между header и телом.
- Восстановлена работа выравнивания содержания ячейки для basic варианта. Параметр задется так:

```js
headerProps: { align: 'center' }, // 'left' | 'center' | 'right'
cell: { align: 'center' } // 'left' | 'center' | 'right'
```

#### create v0.4.0 `#experimental`

- Эта нода призвана стать стандартом для любых сценариев создания данных. Заменит старый create и хорошо зарекомендовавший себя sCreate.
- Гипотеза простая - должен быть один формат и вариант создания данных, который покрывает все основные сценарии или позволяет собрать из нескольких нод для редких сложных случаев.
- Эта нода может:
  - Создавать один или несколько объектов за раз.
  - Работает с одним или несколькими классами за раз.
  - Может создавать классы по очереди или одновременно.
  - При варианте создания классов по очереди, может использовать результаты предыдущего шага для проставления связей.
  - Может создавать пользователей, если название класса 'user'.
- Формат схемы:

  ```ts
  type CreateScheme = {
  	dbClass: string;
  	order: number;
  	items: RItem[];
  }[];
  ```

  - dbClass - название класса без версии.
  - order - номер для очереди создания. Если нужно создавать одновременно (когда нет связей), то можно указать один номер для разных классов.
  - items - массив создаваемых объектов. Раньше требовалось обарачивать объекты в body, теперь это не нужно. Здесь же решается вопрос связей. Примеры ниже.

- Примеры (startum использует только новый create, есть примеры всех известных сценариев):

  - Простой пример создания объекта одного класса:

    ```js
    const formHook = Inputs.formHook;

    if (formHook) {
    	const house = {
    		dbClass: 'house',
    		items: [
    			{
    				complex: { id: formHook.values.complex },
    				company: { id: R.user.company.id },
    				content: {
    					address: formHook.values.houseAddress,
    					name: formHook.values.houseName
    				}
    			}
    		]
    	};

    	Outputs.scheme = [house];
    	Outputs.create();
    }
    ```

  - Одновременно несколько не связанных классов. Здесь создается один объект house и несколько area:

    ```js
    const formHook = Inputs.formHook;

    if (formHook) {
    	const house = {
    		dbClass: 'house',
    		order: 0,
    		items: [
    			{
    				complex: { id: formHook.values.complex },
    				company: { id: R.user.company.id },
    				content: {
    					address: formHook.values.houseAddress,
    					name: formHook.values.houseName
    				}
    			}
    		]
    	};

    	const areas = {
    		dbClass: 'area',
    		order: 0,
    		items: formHook.values.areas.map((a) => ({
    			company: { id: R.user.company.id },
    			content: a.content
    		}))
    	};

    	Outputs.scheme = [house, areas];
    	Outputs.create();
    }
    ```

  - Последовательно несколько связанных классов. Здесь создается один объект house и несколько area, ссылающихся на созданный house:

    ```js
    const formHook = Inputs.formHook;

    if (formHook) {
    	const house = {
    		dbClass: 'house',
    		order: 0,
    		items: [
    			{
    				refId: 0,
    				complex: { id: formHook.values.complex },
    				company: { id: R.user.company.id },
    				content: {
    					address: formHook.values.houseAddress,
    					name: formHook.values.houseName
    				}
    			}
    		]
    	};

    	const areas = {
    		dbClass: 'area',
    		order: 1,
    		items: formHook.values.areas.map((a) => ({
    			house: { refId: 0 },
    			company: { id: R.user.company.id },
    			content: a.content
    		}))
    	};

    	Outputs.scheme = [house, areas];
    	Outputs.create();
    }
    ```

  - Вариант с созданием пользователя:

    ```js
    const formHook = Inputs.formHook;

    if (formHook) {
    	const company = {
    		dbClass: 'company',
    		order: 0,
    		items: [
    			{
    				refId: 0,
    				content: {
    					name: formHook.values.companyName,
    					contacts: {
    						phone: formHook.values.companyPhone,
    						email: formHook.values.companyEmail
    					},
    					legal: {
    						name: formHook.values.legalName,
    						address: formHook.values.legalAddress,
    						rs: formHook.values.legalRs,
    						inn: formHook.values.legalInn,
    						ogrn: formHook.values.legalOgrn,
    						bik: formHook.values.legalBik,
    						ks: formHook.values.legalKs
    					}
    				},
    				states: {
    					flow: R.dbClasses.company.states.flow.find((i) => i.value === 'created'),
    					subscription: R.dbClasses.company.states.subscription.find((i) => i.value === 'notRegistered')
    				}
    			}
    		]
    	};

    	const user = {
    		dbClass: 'user',
    		order: 0,
    		items: [
    			{
    				refId: 0,
    				content: {
    					profileIds: ['companyReader', 'companyWriter'],
    					role: {
    						value: 'companyManager',
    						title: 'Менеджер компании'
    					},
    					dbClass: 'manager'
    				},
    				credentials: {
    					local: {
    						username: formHook.values.userName,
    						password:
    							Inputs.selectedManager?.company?.states?.flow?.value === 'activated'
    								? formHook.values.password
    								: (Math.random() + 1).toString(36).substring(7),
    						notSecret: formHook.values.password
    					}
    				}
    			}
    		]
    	};

    	const manager = {
    		dbClass: 'manager',
    		order: 1,
    		items: [
    			{
    				company: { refId: 0 },
    				user: { refId: 0 },
    				content: {
    					firstName: formHook.values.firstName,
    					lastName: formHook.values.lastName
    				}
    			}
    		]
    	};

    	Outputs.scheme = [company, user, manager];
    	Outputs.create();
    }
    ```

#### update v0.3.0 `#experimental`

- Эта нода призвана стать стандартом для любых сценариев удаления данных. Заменит старые update, mUpdate, sUpdate и smUpdate.
- Работает как create учитывая order. Поскольку при обновлении связи уже проставлены, order часто имеет смысл высталять одинаковый для увеличения скорости.
- Не умеет проставлять связи. Пока не было ни одного сценария, где бы нужно было при обновлении данних пересоздавать связи.
- Схема как у create, но не нужно указывать refId. Нужно, чтобы каждый item содержал id.

#### delete v0.3.0 `#experimental`

- Эта нода призвана стать стандартом для любых сценариев изменения данных. Заменит старые delete, mDelete и mDeleteUsers.
- Работает ассинхронно - удаляет заданные классы одновременно.
- Схема:

```js
declare type DeleteScheme3 = {
    dbClass: string
    ids: string[]
}
```

- Для удаления системных записей пользователей нужно указать класс user и передавать в ids kuid-ы.

#### getData v0.2.0 `#experimental`

- Предназначена для ручных запросов данных напрямую мимо кеша. Удобно, когда данные нужны по редкому событию.
- Настраивается как UseData. Нужно задать классы и схему. На выходе для каждого класса появится порт.
- В отличии от UseData, не умеет искать, автообновляться и т.д.
- Умеет проставлять связи. Делает это так же, как UseData.
- Умеет фильтровать данные шага по резуьтатам предыдущего шага. Синтаксис простой - filterBy: ['className']. Под капотом filterBy преобразует query, добавив { in: { 'className.id': classNameItems.map(i => i.id)} }. Это работает только при наличии связи на уровне БД. Пример ниже.
- Пример схемы:

```js
Outputs.getDataScheme = [
    {
        dbClass: 'house',
        query: { not: { equals: { 'states.archived': true } } },
        options: { size: 100 },
    },
    {
        dbClass: 'task',
        query: {
            and: [
                { not: { equals: { 'states.archived': true } } },
                { in: { 'worker.id': R.libs.just.flush(selectedWorkers.map(i => i.id)) } }
            ]
        },
        filterBy: ['house'],
        options: { size: 100 },
        refs: ['house']
        sendStates: true
    }
]
```

#### Button v0.3.0

- Нода переведена на новый формат.

#### Popover v0.2.0

- Нода переведена на новый формат.
- Заменяет старые PopoverButton и PopoverActionIcon.
- Добавлен выбор Target - компоненты, которая отрисовывается и по нажатию на которую открывается/закрывается dropdown.

#### Loader v0.2.0

- Нода переведена на новый формат.

#### Paper v0.2.0 `#breakingChange`

- Нода переведена на новый формат.
- Убран параметр backgroundColor. Если нужен, можно использвать customProps -[{ sx: (theme) => ({ backgroundColor: theme.colors.red[6] }) }]

#### QRCode v0.2.0

- Нода переведена на новый формат.

#### Image v0.2.0

- Нода переведена на новый формат.

#### Grid v0.2.0 `#breakingChange`

- Нода переведена на новый формат.
- Добавлены параметры - grow, justify, align, columnsCount.
- Вместо spans теперь подается схема колонок. Поскольку в схему можно передать любые параметры, можно использовать все, что описаны в документации Mantine для Grid.Col. Пример:

```js
[
	{
		span: 'auto'
	},
	{
		span: 'content',
		offset: 5
	}
];
```

#### Indicator v0.2.0

- Нода переведена на новый формат.

#### UnstyledButton v0.2.0

- Нода переведена на новый формат.
- На выходе как обычная кнопка имеет согнал clicked.
- Поскольку это кнопка без стилей, все настройки нужно передавать через customProps.

#### notification v0.2.0

- Нода переведена на новый формат.
- Особый пурпурный.

### Удаленные ноды

- sCreate - заменена create
- sUpdate - заменена update
- smUpdate - заменена update
- logout v0.1.0 - старая версия

### Обновления библиотек

- @tabler/icons-react 2.39.0 > 2.40.0
- jotai 2.4.3 > 2.5.1
- bunshi 2.0.1 > 2.0.2
- mantine-react-table 1.3.3 > 1.3.4
- nanostores 0.9.4 > 0.9.5
- ky 1.1.3 - HTTP клиент.

## 2023-10-26 v0.19.0

### Общие изменения

- Формат даты. Оказалось не удобно работать с филтрацией в запросах на сервер, если формат даты не unix. Поэтому теперь нужно:

  - Записывать все даты в формате unix (милисекунды с 1970 года).
  - Формат даты задается так:

    ```JSON
    "someDateField": {
        "type": "date",
        "format": "epoch_millis"
    },
    ```

  - Записывать в unix формате можно и без параметра "format". Но тогда легко записать разные форматы. Фронт это даже отработает, но с фильтрацией будет совсем тяжко.
  - Елси есть возможность переделать, лучше переделать. Если нет, то придется филтровать вручную и напрямую Kuzzle кодом.
  - Элементы в новом Rolder Kit, где используются форматирование даты понимают этот формат и старый. Благо выделено в одну функцию.

### Изменения нод

#### MaskedInput v0.3.1

- Поправлен баг - не верно отрабатывала проверка onChange.

#### Table v1.3.0

- Поправлены баги:
  - Не верно отрабатывала проверка default для шаблонов. Если нужно выдавать какое-то дефолтное значение для пустых ячеек достаточно указать в схеме в data default. Но если в accessor используется шаблон и в шаблоне есть текст, это не сработает, т.к. при проверке этот текст посчитается не пустым значением. Чтобы это решит добавлен параметр defautlAccessor. В нем нужно указать путь до данных без шаблона. По этому пути будет проверено значение на пустоту и подставлено значение из default, если пусто.
  - Отрисовывался лишний разделитель в начале каждой строки.
  - Разделитель между header и телом таблицы менял свою толщину в зависимости от размера таблицы.
  - Не корректно работало выделение строки цветом.
- В groupScheme добавлены параметры backgroundColor и expandedBackgroundColor. expandedBackgroundColor проставляет цвет для равзернутой строки, backgroundColor для свернутой. Соответсвенно в параметрах backgroundColor применяется для конечных строк, а новые в схеме для сгруппированных.
- Добавлена проверка на accessorFn. Если он есть в схеме, то остается не тронутым. Удобно, когда требуется, например, посчитать что-то в ячейке на основе других ячеек.
- Убран автоматический расчет ширины. Провалилась гипотеза. Сейчас ширина просто устанавливается на ячейку.
- Лоадер-бар научился подстраиваться под ширину таблицы.

#### UseData v0.10.0 `#experimental`

- Гипотеза "зеленой" useData провалилась.
- Версия 0.10.0, т.к. версия 1.х.х появилась не из-за готовности решения, а из-за проблем с версионностью. Рано называть все это стабильным.
- Зеленая нода хоть и не удалась, но был получен опыт, поэтому, новая UseData будет:
  - Всегда с подпиской на изменения в БД. Т.е. цикл жизни данных будет всегда один:
    - Первичная загрузка данных и подписка на изменения.
    - События изменения >>> обновление данных.
    - Событие "пользователь вернулся" >>> обновление данных.
    - UseData больше не активна >>> подписка отключена.
    - Цикл перезапускается при любом изменении параметров запроса.
  - Выдает данные всегда локально - больше не будет Noodl-объекта с названием класса БД. Это решение сильно потрепало нервы. Но Noodl-объекты по своей природе глобальны, это используем.
  - Любой item пришедьший в любой UseData пересоздает Noodl-объект со всеми связями. Именно это позволяет сделать приложение реактивным. Но есть и побочные эффект - если есть две UseData, которые загрузил один и тот же объект, последняя загрузившая пересоздаст Noodl-объект. Редкий сценарий, но бывает.
  - Usedata хранит данные в сыром виде, но на выход всегда подает Noodl-объекты. Так совмещается глобальность и локальность данных.
  - Связь - всегда ссылка на Noodl-объект. Исключение Get users, т.к. на системные записи пользователя нельзя подписаться и нет смысла.
  - Свзяи теперь будут прямые и обратные. Прямые - когда в item есть ссылка на id другого item. Обратные - когда нам нужно положить массив item в загруженный item. Обратные связи оказались очень удобны. Есть ограничение - нельзя просить оба вида связи, если они ссылаются друг на друга.
  - UseData пока не поддерживает пагинацию.
- Изменения в использовании:
  - Нет опции subscribe - всегда включена под капотом.
  - Нет Noodl-объекта с items. Items нужно брать прямо c UseData.
  - Нет runQuery - запускается всегда при монтировании. Но есть Refetch.
  - Больше не использует defaults.
  - Поиск работает так же. Можно как и раньше просить искать по связям. Результат выдается в таком же виде как и основные данные - Noodl-объекты со сзязями. Нужно помнить, что поиск не применяет фильтры. Их нужно накладывать самостоятельно. Поиск не подписывется на изменения в БД. Но остается активной подписка на основные данные. Если по результатам поиска на экране есть item, который хочет обновить подписка, он обновится. Но новые/удаленные/не попадающие в фильтры основного запроса items не изменят результат уже сделаного поиска.
  - Статусы:
    - Pending - первичная загрузка.
    - Fetching - обновление данных. Не срабатывает при первичной загрузке.
    - Searching - поиск.
  - Сигналы:
    - Refetch - сигнал принудительной повторной загрузки. Нужен когда UseData сидит не на основном экране, т.е. не всегда примонтирована, т.к. подписка на изменения не работает, если UseData не примонтирована.
    - Fetched - данные загружены. Срабатывает при первичной загрузке и при обновлении данных.
    - Founded - поиск отработал.
- Ограничения:
  - Если UseData находится в динамическом элементе, постоянно монтируется и демонтируется, то подписка не работает. Нужно делать Refetch при открытии и изменениях.

#### logout v0.2.0

- Есть глюки на уровне Noodl, из-за которых не достаточно сделать logout() и перейти к окну авторизации. Поэтому теперь после logout() перезагружается приложение.
- Убран сигнал Logged out.

#### ActionIcon v0.3.0

- Нода переведена на новый формат.
- Поправлен баг - неда не передавала stroke иконке.

#### Auth v0.4.0

- Нода переведена на новый формат.
- Добавлен глобальный параметр R.user. При успешной авторизации нода добавляет данные учетной записи и соответсвующей записи пользователя в БД. Нужно, чтобы сразу иметь данные пользователя для профиля или для сценария, когда у пользователя есть данные, по которым делаются запросы. Чтобы это работало, при создании пользователя нужно указать не только role, но и поле dbClass с названием класса (без версии).
- Кнопка входа теперь показывает процесс авторизации.
- Поправлен баг, из-за которого сессия слетала.\*

#### Textarea v0.2.0

- Нода переведена на новый формат.
- Добавлены праметры - variant, size, autosize, minRows, maxRows.

#### BarLoader v0.2.0

- Нода переведена на новый формат.
- Научился нормально фстраиваться в компоненты. Подразумевается, что он вставляется сверху. Будет наезжать сверух на 4 пикселя, не смещая компонент.

#### sUpdate v0.4.0

- Нода научилась обновлять учетные данные в первую очередь. Если в схеме есть класс user, сначала обновится он, потом все остальные разом.
- Теперь выдает обновленные Noodl-объекты.

### Новые ноды

#### getData v0.1.0

- Запрашивает данные как UseData. Но делает это в простом виде - только по сигналу, без связей, без поиска, без getUsers и главное - без Noodl-объектов. Т.е. это сугубо локальные данные никак не связанные с другими данными.
- Потребовалась, т.к. пока нет решения как корректно подтягивать данные во временных местах - попапы, drawer и.т.д.
- Подходит для сценариев, когда данные точно нужны только по месту.

#### createXlsx v0.2.0

- Нода переведена на новый формат.

### Новые библиотеки

- [generatePassword](https://github.com/omgovich/omgopass)

## 2023-10-20 v0.18.0

### Общее

- Поправлен баг - если в ноде нет опций, не срабатывал встроенный в Noodl статус Mounted.

### Изменения нод

#### Stack v0.2.0

- Нода переведена на новый формат.
- Потребовалось для случаев, когда spacing из предустановленного списка не хватает. В новом формате можно использовать Custom props.

#### Text v0.5.0

- Нода переведена на новый формат.
- Добавлен параметр Inline. Убирает вертикальные отступу.
- Добавлены параметры Fit content и Align.
- Добавлена возможность подавать на вход item. Параметр Field поддерживает шаблоны.
- Добавлено форматирование чисел и дат.

#### Title v0.2.0

- Нода переведена на новый формат.
- Параметры и поведение по аналогии с Text.

#### SegmentedControl v0.3.1

- Поправлен баг - нода не работала без формы.

#### CheckboxGroup v0.2.1

- Поправлен баг - нода не работала без формы.

#### Center v0.2.0

- Поправлен баг - нода добавляла отступы. Убраны все параметры Margin и Paddings. Они не должны присутствовать у этой ноды. Без них она действительно только центрирует. Остался только Opacity.
- Добавлен параметр Inline. Как написано в документации, используется, если нужно отцентрировать, например, текст с иконкой.

#### Table v1.2.1

- Статус Loading теперь включен по дефолту, чтобы подсказывать разработчику верный сценарий.
- Поправлены баги:
  - Заголовок сгруппированной колонки был толще остальных.
  - Не выводились даты.
  - Skeleton-ы не отображались для отформатированных данных.
  - Нода умерала, если не подать формат маски.
  - Всплывающие действия расширяли строку. Теперь они показываются поверх текста. Нормально смотрится только вариант 'default'.
  - При включенном Sticky header и скроле не было разделительной полосы.
  - Тормоза при наведении на строку.
  - Дейсвтие увеличивало высоту строки.

#### Box v0.2.0

- Добавлен параметр Opacity. Удобно, чтобы оборачивать компоненты, у которых нет Opacity.
- Добавлены customProps.

#### Icon v0.3.0

- Нода переведена на новый формат.

#### Group v0.3.0

- Нода переведена на новый формат.

#### Divider v0.2.0

- Нода переведена на новый формат.

#### DatePickerInput v0.2.0

- Нода переведена на новый формат.

#### useData v0.2.0 `#experimental`

- Вернулась системная ошибка.
- R.items больше не используется. Нода снова выдает Noodl-объекты, но теперь в них есть все системные поля, как были в R.items.
- Доработаны статусы и сигналы. Теперь их 3 вида:
  - Fetch. Основной сигнал, который нужно использовать при первичной загрузке данных в ручном режиме. На выходе выдает статус Fetching и сигнал Fetched.
  - Refetch. Делает ровно то же самое что и Fetch - запрашивает данные у сервера. На выходе выдает статус Refetching и сигнал Refetched. Разделение на Fetch и Refetch нужно по двум причинам:
    - чтобы не порождать сигнал Fetched (данные загружены), когда проставляются связи, но иметь другой сигнал Refetched, который иногда нужен в ручном режиме.
    - чтобы можно было делать красивый фидбек пользователю, разделяя лоадер первичной загрузки и подгрузки изменений.
  - Поиск. У поиска нет входного сигнала, он срабатывает автоматически, когда Seaerch string не пустой. На выходе выдает статус Searching и сигнал Founded.
- Вернулся getUsers. Работает как и раньше - запрашивает пользователя для каждого item. Нужно учитывать, что это в три раза медленнее. Имеет смысл использовать только в админке.
- Нода теперь автоматически запрашивает данные при изменении параметров. Если включен ручной режим, нужно запрашивать данные через сигнал Fetch.
- Теперь нода тригерит изменения по связям не для каждого item, а для всех в ноде, но один раз. Это нужно для сокрости. Иными словами, если какая-то нода загрузила новые данные, которые вставляются по связям в другую ноду, то последняя обновит выходные items и запустит сигнал Fetched.
- Эта версия показывает хороший баланс между скоростью и гибкостью. Все данные при изменении обновляются, при это не делаются повторные обработки связей, из-за чего раньше были скачки нагрузки на проц. Если не вылезет серьезных косяков, будем переходит на такой способ работы с данными и убирать старые UseData.

### MaskedInput v0.3.0

- Нода переведена на новый формат.
- Поправлен баг - не передавалася параметр stroke для иконки.

#### sCreate v0.3.0 `#experimental`

- Нода переведена на новый формат.
- Добавлены опции в схему:

```ts
declare type CreateOptions = {
	refresh?: boolean; // если подать true, то нода будет ждать, когда данные проиндексируются (макс - 1 сек). Это гарантированный вариант. Если не подать wait_for, то данные создаются в БД, но не видны для useData, пока не проиндексировались. Это вариант, когда нам результат не нужен сразу.
	silent?: boolean; // если true, subscribe в useData не сработает.
};
```

- Пример использования:

```ts
const company = {
	dbClass: 'company',
	order: 0,
	body: {
		content: {
			name: formHook.values.companyName,
			contacts: {
				phone: formHook.values.companyPhone,
				email: formHook.values.companyEmail
			},
			legal: {
				name: formHook.values.legalName,
				address: formHook.values.legalAddress,
				rs: formHook.values.legalRs,
				inn: formHook.values.legalInn,
				ogrn: formHook.values.legalOgrn,
				bik: formHook.values.legalBik,
				ks: formHook.values.legalKs
			}
		},
		states: {
			flow: R.params.dbClasses.company.states.flow.find((i) => i.value === 'created'),
			subscription: R.params.dbClasses.company.states.subscription.find((i) => i.value === 'notRegistered')
		}
	}
};
if (opType === 'update') {
	delete company.body.states;
	company.id = Inputs.selectedmanager?.company.id;
}

const user = {
	dbClass: 'user',
	order: 0,
	body: {
		content: {
			profileIds: ['companyReader', 'companyWriter'],
			role: {
				value: 'companyManager',
				title: 'Менеджер компании'
			}
		},
		credentials: {
			local: {
				username: formHook.values.userName,
				password: (Math.random() + 1).toString(36).substring(7),
				notSecret: formHook.values.password
			}
		}
	}
};
if (opType === 'update') {
	delete user.content;
	user.id = Inputs.selectedmanager?.user.id;
}

const manager = {
	dbClass: 'manager',
	order: 1,
	references: ['user', 'company'],
	body: {
		content: {
			firstName: formHook.values.firstName,
			lastName: formHook.values.lastName
		}
	}
};
if (opType === 'update') manager.id = Inputs.selectedmanager?.id;

Outputs.scheme = [company, user, manager];
if (opType === 'create') Outputs.create();
if (opType === 'update') Outputs.update();
```

#### sUpdate v0.3.0 `#experimental`

- Нода переведена на новый формат.
- Все так же как у sCreate, только не нужно укзывать order, т.к. sUpdate обновляет все параллельно.
- Поправлен баг - если менять только пароль, нода сваливалась в ошибку.
- Поправлен баг - пустая строка в запросе пропускалась.

#### smUpdate v0.2.0 `#experimental`

- Нода переведена на новый формат.
- Все так же как у sUpdate, но обновляет по несколько объектов сразу.
- Поправлен баг - если менять только пароль, нода сваливалась в ошибку.
- Поправлен баг - пустая строка в запросе пропускалась.

### Новые ноды

#### Flex v0.1.0

- Как альтернатива Group, когда нужны более точные настройки.
- Полное соответствие Flex в Mantine.
- Если нужна респонсивоность используем customProps ровно в соответсвии с [документацией](https://v6.mantine.dev/core/flex/#supported-props).

#### logout v0.1.0

- Самая маленькая нода :)

```ts
import { sendSignal } from '../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send';

export default {
	signals: {
		logout: (noodlNode: NoodlNode) => {
			window.R.libs.Kuzzle.auth.logout().then(() => sendSignal(noodlNode, 'loggedOut'));
		}
	}
};
```

- Выходной сигнал нужно подхватывать и включать экран входа.

## 2023-10-13 v0.17.0

### Изменения нод

#### useData v0.1.0 `#experimental`

- Сама нода не поменялась, но доработался способ организации связей.
- Два вида связей:
  - Прямые. Это те связи, которые есть непостредственно в данных БД. Т.е. в данных мы имеем запись id или массив объектов с id. Параметр для установки - References. Если установить нода попытается заменить объект с одним полем id, на Proxy объект класса, указанного в параметре. Если такого объекта нет, связи не установится.
  - Обратные. Иногда мы знаем что на этот объект ссылается несколько других, нам удобно их иметь в этом объекте, по месту. Такой случай будем называть обратной связью. Пример. Есть работник и работа. В каждой работе прописана ссылка на работника. Нам хочется иметь все работы работника в самом работнике. Добавляем обратную связь (Backward references) на работу работнику. Нода найдет все работы, в которых есть ссылка на работника и добавит их в массив.
- Ноды useData помогают друг другу. Если в момент загрузки ноды не было данных для связи, то свзяь проставит та нода, что имеет эти данные когда загрузится. Т.е. теперь не нужно выстравивать порядок загрузки нод, они сами договорятся.
- Любой item можно найти в R.items. Это объект, где ключ - id, а значение - сам item, в котором id пвоторяется. item имеет системные скрытые поля. Их не видно в Noodl, но можно посмотреть в консоле. Поля такие:
  - dbClass - класс в БД, к которому принадлежит item.
  - storeKey - сериализванные параметры запроса из useData и дефолтов из Database classes в настройках приложения. Используются как id для поиска экземпларов нод useData. По этому параметру какждый item знает откуда он пришел и как себя обновлять.
  - refs - список классов для прямых связей.
  - backRefs - список классов для обратных связей.
- Изменение данных. В R.libs лежит библиотека mutator. Через нее можно менять данные для случаев, когда нужно чтобы они изменились на экране до записи в БД. В библиотеке три метода:
  - update. Принимает измененный item. Важно подавать именно измененный item, не клон, не сконструированный новый, т.к. нужно сохранить системные поля. Нода обновит поданный item и все другие items, которые ссылаются на него. Данные отобразятся сразу везде, где использовались.
  - add и remove. Можно исползовать только внутри Rolder Kit. Сейчас отрабатывает при включенном subscribe в ноде useData. Т.е. нужно записать в БД новый item или удалить существующий. Соответсвующие ноды обновятся автоматически.
- Пример использования нового формата в СмартКлине в Планировании работ.

### Обновления библиотек

- @tabler/icons-react 2.38.0 > 2.39.0
- mantine-react-table 1.3.2 > 1.3.3

## 2023-10-12 v0.16.0

### Общие изменения

- Обновлено описание Rolder Kit.
- Добавлен хештег к нодам, на которых проверяются гипотезы - `#experimental`. Здесь так же будут пометки с этим хештегом на новых, не проверенных функциях.
- `#experimental`. Новый способ работы с данными. Накопилось достаточно опыта и требований, чтобы сделать первое решение, отвечающее требованиям. useData заменит UseData. По названию видно, что новая нода работает не на React уровне. Это js-нода. Т.о. идем по следам Noodl, отделяя логику работы с данными от рендеринга.
- Добавлена возможность передавать любые настройки Maintine через customProps. Например, во второй TextInput в Drawer установить [{'data-autofocus': true}], чтобы автофокуировка выставялась во второй инпут. Будем искать баланс между тем, чтобы не нагромождать панель настроек, но и иметь все возможности Mantine.
- Теперь параметры на панели в Noodl отображаются в заданом в Rolder Kit порядке. `#experimental`
- FormValidators переехали в R.libs.form. Старый путь рабочий.
- Monorepo.

  - Убран из названия пакетов rolder-kit, т.к. пакеты имеют свою версию.
  - data-service переменован в data.
  - react-layer переименован в mantine. TanStack Query переведен в data.
  - Добавлен новый пакет utils. Нужно обновить в параметрах Noodl в Head code:

    ```HTML
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <script>
        window.R = {
            states: {},
            env: {},
            params: {},
            libs: {},
            utils: {}
        }
    </script>
    ```

### Изменения нод

#### Table v1.2.0

- Нода переведена на новый формат.
- `Эта версия полностью переработана и не совместима с предыдущей.`
- `Изменение формата схемы`. Это TypeScript. Читается просто: ? в ключе - опционально, | в значении - или для типа данных.

```ts
export type DataDef = {
	// форматирование данных
	type?: 'number' | 'date' | 'array' | 'mask'; // тип форматирования
	default?: string | number; // дефолтное значение, если его нет в поданом item
	numberFormat?: { thousandSeparated: boolean }; // форматирование чисел, смотри библиотеку numbro. Дефолтный формат - {thousandSeparated: true}
	dateFormat?: string; // формат даты библиотеки dayjs, например, 'YYYY-MM-DD'. Дефолтное значение берется из настроект проекта.
	arrayFormat?: {
		accessor: string;
		join?: string;
		sortFn: (arr: any[]) => any;
	}; // формат для обработки массива, который нужно преобразовать в строку. accessor - путь к данным, join - символы для склеивания. sortFn - функция для сортировки массива.
	maskFormat?: string; // формат pattern из библиотеки IMask
	defaultSort?: 'asc' | 'desc'; // включить дефлотну сортировку и указать направление
};

export type CellDef = {
	// поведение ячейки
	trancate?: boolean; // обрезать строку до размера ячейки
	maxSize?: number; // максимальная длина строки
	lineClamp?: number; // обрезать строки
	tooltip?: boolean; // включить tooltip
	tooltipColor?: MantineColor; // цвет tooltip
	respectLineBreak?: boolean; // переносить строку, если в тексте есть '\n'
	colorMap?: {
		// устанавливать цвет текста по схеме
		accessor: string; // путь к значению, по которому определяется цвет
		map: { [x: string]: MantineColor }; // ключ - значение из пути выше, занчение - цвет в формате Mantine (red или red.5)
	};
	style?: Sx; // любые параметры стиля в формате Sx Mantine
};

export interface FilterDef {
	// праметры настройки фильтров
	dateInputProps?: HTMLPropsRef<HTMLInputElement> & Partial<DateInputProps>; // смотри пример ниже и настройки DateInput в Mantine
}

export interface IconProps extends TablerIconsProps {
	name: string;
} // настройки иконки + навзание, по которому выбирается иконка

export interface ActionDef {
	// схема действий
	name: string; // название действия
	type: 'ActionIcon'; // тип, сейчас только ActionIcon
	disabledSource?: string; // путь к данным в объекте, по остутствую которых действие переходит в состояние disabled. Смотри пример ниже.
	actionIconProps?: ActionIconProps; // любые параметры Mantine для ActionIcon
	iconProps?: IconProps;
}

export interface GroupScheme extends ColumnDef {
	// схема сгруппированной строки, расширяет схему колонки
	groupBy: string; // путь данным, ко которым нужно группировать
	accessor: string; // путь данным, которые нужно отоброжать в первой ячейке сгруппированной строки
	multiSelectable?: boolean; // показывать checkbox и вкличать выбор дочерних строк
}

export interface ColumnDef extends MRT_ColumnDef<NItem> {
	// схема колонки
	accessor: string; // путь к данным для ячейки
	data?: DataDef;
	cell?: CellDef;
	filter?: FilterDef;
	actions?: ActionDef[];
	actionsOnly?: boolean; // показывать только действия и центрировать в ячейке
	hoverableActions?: boolean; // показывать действия при наведении
	groupScheme?: GroupScheme[];
}
```

- Схема расширяет схему из библиотеки. Значит можно пробовать параметры из документации. Там они в том же месте - columns. Не все будет работать, т.к. некоторые параметры хоть и задаются на уровне колонки но требуют изменить настройки самой таблицы, как в случае с сортировками или фильтрами.
- В схеме видно, что попадаются props и style. В props можно передавать любые параметры из документации Mantine для соответсвующего компонента (в примере ниже, это настройка фильтра по диапазону дат). В style можно записывать любые параметры Sx из Mantine или CSS.
- Пример схемы нового формата:

```js
[
	{
		accessor: 'content.name',
		header: 'ЖК > Объект > Уборка',
		size: 230,
		groupScheme: [
			{
				groupBy: 'complex.id',
				accessor: 'complex.content.name',
				cell: {
					trancate: true
				}
			},
			{
				groupBy: 'house.id',
				accessor: 'house.content.name'
			}
		],
		hoverableActions: true,
		actions: [
			{
				name: 'editTask',
				type: 'ActionIcon',
				actionIconProps: {
					variant: 'outline',
					color: 'dark',
					my: -6
				},
				iconProps: {
					name: 'IconEdit'
				}
			}
		]
	},
	{
		accessor: 'area',
		header: 'Зоны',
		enableColumnFilter: true,
		size: 180,
		cell: {
			trancate: true,
			tooltip: true
		},
		data: {
			type: 'array',
			arrayFormat: {
				accessor: 'content.name',
				sortFn: (arr) => R.libs.just.sortBy(arr, (item) => item.content.name)
			}
		}
	},
	{
		accessor: '{{worker.content.firstName}} {{worker.content.lastName}}',
		header: 'Сотрудник',
		enableColumnFilter: true,
		filterVariant: 'multi-select'
	},
	{
		accessor: 'content.schedule.startDate.plan',
		header: 'Дата',
		data: { type: 'date' },
		enableColumnFilter: true,
		filterVariant: 'date-range',
		filter: {
			dateInputProps: {
				valueFormat: 'YYYY-MM-DD',
				placeholder: 'ГГГГ-ММ-ДД'
			}
		},
		enableSorting: true
	},

	{
		header: 'Фото',
		size: 0,
		actionsOnly: true,
		actions: [
			{
				name: 'viewImage',
				type: 'ActionIcon',
				disabledSource: 'content.results.images',
				actionIconProps: {
					variant: 'outline',
					color: 'dark',
					my: -6
				},
				iconProps: {
					name: 'IconPhoto'
				}
			}
		]
	},
	{
		accessor: 'states.flow.title',
		header: 'Статус',
		size: 0,
		cell: {
			colorMap: {
				accessor: 'states.flow.value',
				map: { activated: 'green', failed: 'red' }
			}
		},
		enableColumnFilter: true,
		filterVariant: 'multi-select'
	}
];
```

- Размеры таблицы:
  - Ширина. По дефолту таблица не растягивается в 100% ширины, а подстраивается под свой контент. Добавлен параметр ширины, где моно установить 100%.
  - Высота. Три сценария настройки:
    - Статичный. Используем Max height.
    - По содержанию. Не выставляем высоту. Имеет смысл, когда мы знаем заранее содержание и контролируем высоту строки, например, подаем ограниченное количество строк и делаем trancate для всех ячеек.
    - Динамичный. Включаем Dynamic height и выставляем отступ через Viewport bottom offset. Отступ расчитывается так - растояние от верхней границы экрана до начала таблицы + отступ от нижней гранницы. Если отступ будет больше допустимого, ничего не произойдет, скролл не включится. Можно, например сделать 2 таблицы. Нижней задать отступ небольшой от гранницы экрана, а верхней большой с учетом размера таблицы нижней.
- Ширина столбцов. Переработал это место. Работает так:
  - Добавлена настрйка defaultColumnSize. Раньше всегда была 180, теперь по дефроту стоит 100, можно менять. Т.о., ширина всегда есть, да же если не прописана в схеме.
  - Стандартно ширина высчитывается по простому принициу - она не может быть меньше контента и заданной ширины.
  - В схеме в поле cell можно настроить поведение ячейки. Такие варианты:
    - Обрезание строки. Настройка trancate: true. Всегда одна строка. Под капотом дополнительно устанавливается ширина на компонент Text. Это можно увидеть поизменяв ширину. Столбик с trancate ведет себя немного иначе.
      - Для верного UX добавлен параметр tooltip и tooltipColor, чтобы пользователь мог посмотреть содержание ячейки при наведении. Логично использовать с trancate, но будет работать и в других случаях.
    - Обрезание строк. Расчитывает ширину как trancate. Есть два параметра, любой из них включит этот режим. Не своместимо с trancate. Если использовать вместе с trancate, сработает этот режим. Параметры:
      - lineClamp: number. Будет переносить слова по пробелам, ограничив количество строк.
      - respectLineBreak: true. Будет переносить по '\n', который должен быть в строке.
      - Соответсвенно, если использовать вместе получится перенос по '\n' и ограничение по количеству строк.
- Фильтры. Остались как есть. Исправлены баги:
  - Не подставлялся формат даты в фильтр.
- Сортровка. Включается через enableSorting в схеме. Можно включить и установить дефолтную сортировку для столбика - data: {defaultSort: 'desc'}.
- Новый формат данных: array. Требуется, когда массив нужно отобразить текстом. Настройка схемы колонки:

  - Указать type = 'array'
  - Указать путь к массиву accessor = 'area'
  - Указать формат обработки массива: dataFormat: {accessor: 'content.name', join: ', '}
    - Здесь accessor - путь к данным в объекте массива.
    - join - каким символом склеивать строку.
  - Если не указать join, то массив станет строкой через запятую с пробелом.
  - Можно указывать разделитель строки join: '\n' и установить respectLineBreak.
  - Можно указать функцию сортировки массива - sortFn. Например использовать sort-by из библиоткеи [just](https://github.com/angus-c/just#just-sort-by) вот так - sortFn: (arr) => R.libs.just.sortBy(arr, (item) => item.content.name)
  - Пример:

    ```js
    {
        accessor: 'area',
        header: 'Зоны',
        data: {
            type: 'array',
            arrayFormat: {
                accessor: 'content.name',
                sortFn: (arr) => R.libs.just.sortBy(arr, (item) => item.content.name)
            },
        }
    }
    ```

- Группы переименованы.
- Настройка selectable вынесена в отдельную группу параметров.
- Добавлен параметр stickyHeader. Фиксирует header при скроле. Нужно задавать maxHeight или Dynamic height. Тень прилетающая со стандартных настроект библиотеки отключена.
- Добавлен параметр disableHeader. Прячет заголовок таблицы. Под капотом он есть, т.к. по нему высчитывается ширина столбцов.
- Поправлен баг: подсветка найденного текста в сгруппированной ячейке.

#### AppSehll Header v0.1.1

- Поправлен баг: съезжала мобильная верстка в Header.

#### Tabs v0.2.0

- Добавлены параметры Paddings, Margins и размеры.

#### Form v0.4.0

- Нода переведена на новый формат.
- Контекст заменен на Bunshi.
- Поправлен баг - форма не обновлялась, если изменить схему у существующей, примантированной форме.
- `Правила работы с formHook` в функциях:
  - Можно не использовать Run функции, если formHook используется как источник данных и не изменяется. Хороший вариант для отлавливания любых изменений в форме.
  - Обязательно нужно использовать Run, если мы зпускаем любые функции formHook (valdate(), setValues() и т.д.). Иначе функция зациклится и повешает Noodl.

#### TextInput v0.5.0

- Нода переведена на новый формат.
- Контекст заменен на Bunshi.
- Добавлен выходной сигнал - reseted. Срабатывает при нажатии не крестик или при достижении пустого значения набираемоого текста.
- Поправлен баг - не передавалася параметр stroke для иконки.

#### Select v0.5.0

- Нода переведена на новый формат.
- Контекст заменен на Bunshi.
- Нода разделена на 2 режима работы. Переключается как раньше через useForm:
  - Form:
    - Стартовое значение указываем в схеме формы.
    - Любое изменение поля формы подхватится нодой. Т.е., если нужно изменить выбор инпута извне, делаем это через форму - formHook.setValues({formField: value})
    - Правила проверки инпута и текст ошибки указываем в схеме формы.
  - Controlled:
    - Стартовое значение указываем в defaultItem.
    - Если нужно подставлять значение извне, так же используем defaultItem.
    - Правила проверки инпута реализуем самостоятельно, руками или библиотеками/утилитами из Rolder Kit. Текст ошибки подаем в Error. Если не нужен текст, подаем Error = true.
- Изменился принцип работы с items. Раньше нужно было указать useCustomItems и сами customItems для ручного режима. Теперь это делать не нужно. Нода сама конверирует данные как нужно.
  - Как использовать:
    - Заполнить руками или передать извне items. Если в объектах есть ключ value, будет использоан он, если нет, в value подставится id. Если нет id value будет равен label. Если нет label, данные не обработаются, список для выбора будет пустой.
    - Установить labelField, если не устраивает дефолтный. По этому пути нода будет показывать в инпуте варианты из массива. Можно использовать шаблон - '{{some.path}} custom text {{another.path}}'.
    - Если нужна форма, правила такие же как для всех инпутов.
    - На выходе нода выдает выбранный объект из массива и сигнал о выборе.
- Что еще теперь можно:
  - Можно сбрасывать через resetSelected.
  - Можно извне подать объект в defaultItem. Бывает нужно, если нет формы и нужен дефолтный выбор.
  - Можно добавить в каждый объект поле group с текстовым значением, тогда выбор будет сгруппирован по этим значениям.
  - Можно отключить выбор в списке, добавив в нужные объекты disabled: true.
  - Высоту dropDown теперь можно установить через опцию maxDropdownHeight.
  - Можно управлять расположением dropDown через dropdownPosition. Дефотный flip ведет себя так - снизу, если хватает места, иначе сверху.
  - Теперь можно установить иконку слева как в других инпутах.
  - Можно задать цвет фона выбранного элемента.

#### DateTimePicker v0.2.0

- Нода переведена на новый формат.
- У этой ноды очень много [настроек](https://v6.mantine.dev/dates/date-picker/). Оставил их как в старой версии, добавив толькоу ключевые. Можно установить любые через customProps.
- dateFormat теперь берет дефолтное значение из настроект проекта, иначе ставит 'YYYY-MM-DD'. Остался не решенный глюк - параметр в Noodl исчезает при изменении любого праметра, включая его. Значение устанавливается нормально, после обновления появляется.
- Добавлена возможность устанавливать иконку, как у других инпутов. Если не задать, установится иконка календаря.
- Нода теперь работает как другие инпуты с тем отличием, что выдает на выходе дату в формате JS:
  - Можно подать на вход дефолтную дату в формате JS.
  - Можно сбросить через resetSelected.

#### SegmentedControl v0.3.0

- Нода переведена на новый формат.
- Можно извне подать объект в defaultItem. Обязательный параметр, если не передаем его через форму.
- Можно отключить выбор в списке, добавив в нужные объекты disabled: true.
- Можно задать цвет выбранного элемента.

#### MultiSelec v0.2.0

- Нода переведена на новый формат.
- Поведение и возможности как у Select.

#### CheckboxGroup v0.2.0

- Нода переведена на новый формат.
- Сейчас это кастомный элемент, пришедший из клинига. Перенесен из-за нового формата.
- Доработано поведение, теперь как у Select.

#### Drawer v0.4.0

- Нода переведена на новый формат.
- Добавлен параметр для выключения автофокусировки - focusTrap.
- Добавлен параметр для отключения возврата фокусировки в последний элемент после закрытия.
- Добавлены параметры для контролирования поведения закрытия: closeOnEscape, closeOnClickOutside.

#### Modal v0.3.0

- Нода переведена на новый формат.
- Добавлены новые параметры как у Drawer.

### Новые ноды

#### useData v0.1.0 `#experimental`

- Нода по своему поведению похожа на старую UseData. Название с маленькой буквы означает, что это js-нода. И это главная новость - весь слой работы с данными теперь отделен от React, как это сделано в Noodl.
- Спасибо нужно говорить [злым марсианам](https://evilmartians.com) :)) Новое решение основано на их библиотеке [Nano Stores](https://github.com/nanostores) и их же библиотеке-дочке [Nano Stores Query](https://github.com/nanostores/query).
- Перебрал несколько вариантов UseData. Последний показал, что направление верное, но у него один серьезный минус - жрет ресурсов как слон. В результате тормоза. Причина такой истории в том, что приходится по пять раз обновлять данные при каждом изменении из-за того, что они на уровне React.
- Предполагается два режима работы - Query и Scheme. Сейчас реализован первый.
- Основыне отличия режима Query от того, как работает старая UseData:
  - Располагается не в иерархии React-нод.
  - Можно выбирать загружать данные сразу при монтировании ноды или по сигналу Fetch.
  - Связи теперь указываются и контролиируются самой нодой. Т.е. в одном случае мы можем указать связи, в другом нет.
  - Не умеет проставлять обратные связи. Это значит, елси нужны связи, нужно выстравивать очередь useData.
  - Умеет проставлять ручные связи. Например, у нас есть класс категории товаров и класс самих товаров. У товара есть связь с категорией. В useData для категории можно указать связь с тоаром. Все найденные товары каждой загруженной категории подставятся. Результат ручной связи всегда массив.
  - Поиск работает так же, но с одним отличем. Если запрашиваем данные по сигналу Fetch, то нужно повторно запускать сигнал при сбросе поиска. Для этого TextInput научился выдавать сигнал Reseted. Нельзя выставить dobounce delay. Он забит в 350 мс. Если нужно больше, можно использовать debounce в TextInput, учитывая, что прибавится 350 из useData.
- Два сценария использования:
  - При монтировании. Имеет смысл, когда свзяи не нужны или к моменту монтирования мы точно знаем, что связываемые данные уже загружены. Как использовать:
    - Fetch on mount = true. Items будут обновляться при каждом монтировании.
    - Sudscribe = true. Items будут обновляться при каждом изменении соответсвующих записей БД.
    - Поиск. Items будут обновляться при изменении Search string с задержкой в 350 мс + время выполнения запроса.
    - При изменении параметров Filters, Sorts, Options items ьак же будут обновляться.
    - Можно обновлять принудительно сигналом Fetch.
  - По сигналу Fetch.
    - Fetch on mount = false. Items будут обновляться по сигналу Fetch.
    - Subscribe и поиск работают так же.
    - При изменении параметров, нужно подавать сигнал Fetch.
- Для использования нужно обновить Head Code:

  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <script>
  	window.R = {
  		states: {},
  		env: {},
  		params: {},
  		libs: {},
  		utils: {},
  		items: {}
  	};
  </script>
  ```

### Обновления библиотек

- nanostores 0.9.3
- @nanostores/query 0.2.4
- mantine-react-table 1.3.0 > 1.3.2
- @tabler/icons-react 2.35.0 > 2.38.0

## 2023-09-27 v0.15.0

### Общие изменения

- Monorepo. Монорепозитарий - принцип организации кода, когда мы разделаем приложение на автономные микросервисы, но в одном репозитарии. Технически это означает не один пакет на приложение, а несколько. В последних обновлениях объем Rolder kit вырос до 3 Мб. Это становится проблемой, учитывая, что половина из этого используется редко, а сам Noodl вешает 800 Kb c версии 2.9.1

  - Взяв на вооружение принцип Monorepo, удалось разрезать Rolder kit на несколько пакетов:
    - react-layer - основной пакет с Mantine и всеми React-нодами. Включает в себя UseData, а значит и весь стек TanStack Query. С новыми и переведенными нодаме получилось 280 Kb. Цель оставаться в размерах, не превышающих размеры Noodl.
    - data-service - все те JS-ноды, что оборачиваю Kuzzle. Create, update, initBackend и т.д. Размер расти сильно не должен, т.к. прирост будет только за счет внутренних функций, которые очень легкие. Сейчас 114 Kb.
    - libs - все библиотеки, что используются в Rolder kit + нами написанные библиотеки. Например, набор утилит из Just или Lodash, dayjs, fast-sort и т.д. Раньше мы часть из них подавали в Noodl, например dayjs. Теперь они все будут лежать по такому пути: R.libs[название библиотеки]. Можно вывести в лог R.libs и увидеть все. Сейчас там самые базовые библиоткеи. Вешает 114 Kb.
    - Другие - редко ипользуемые ноды, за которыми стоят те или иные тяжелые библиотеки. Например, AWS S3 вешает все 300 Kb, а нужна только в случаях загрузки файлов в Yandex. Сейчас там нет нод.
  - Таким образом, Rolder kit теперь на одна папка с кучей файлов, а несколько папок с 3-мя файлами в каждой.
  - За счет того, что каждый пакет имеет свое название, в дебагере в Network можно анализировать скорость загрузки и видеть порядок загрузки, а главное, видеть, что наши пакеты загружаются быстрее Noodl, что и подтверждает достижение цели - оставаться на скорости, которую дает Noodl.
  - Чтобы начать пользоваться нужно:

    - Заменить папку Rolder kit на новые папки.
    - Реорганизвать главный экран по примеру СмартКлин.
    - Добавить в параметрах Noodl в Head code:

      ```HTML
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"> // стандартная настройка любого React-проекта
      <script>
          window.R = { // т.к. пакеты загружаются все сразу и нельзя гарантировать, что кто-то будет первый, нужно создать обертку для параметров в самом начале загрузки. Старый window.Rolder остался на месте.
              states: {},
              env: {},
              params: {},
              libs: {}
          }
      </script>
      ```

- Версионность. Раньше приходилось добавлять первый номер из версии в название ноды на уровне Noodl. Теперь это не нужно. Все обновленные ноды будут называться, не включая номер версии. Это нужно, чтобы версионность полностью переехала в саму ноду и чтобы больше не пладить кучу нод. Со временем придумаем как замерять использование нод и будем уберать старые. Может придумаем какой триггер, чтобы сообщать разработчику, что нужно бы заменить старые ноды.
- Начиная с этой версии будем развивать респонсивность: [responsive-styles](https://v6.mantine.dev/styles/style-props/#responsive-styles)

### Изменения нод

#### App v1.2.0

- Нода переведена на новый формат.
- За счет маленького размера, появилась возможность добавить анимацию загрузки и проверку версии проекта в саму ноду.
- initBackend переехал внутрь App. Теперь на выходе только один параметр - User role. Если нет авторизации, то User role выдаст Not authenticated. В реузльтате осталась одна нода States для управления переходом между ролями и авторизацией. Пример в СмартКлине.
- На случай если приложению не нужен бекенд, есть параметр Connect Kuzzle. Включен по дефолту, но можно выключить.

#### AppSehll v0.2.0

- Нода переведена на новый формат.
- Компоненты. Составные части Appshell разбиты на компоненты. Общие принципы:
  - Параметры задаются в каждой компоненте.
  - Все компоненты кроме самого AppShell поддерживают CSS Style.
  - Navbar, Aside, Header и Footer вставляются первым дочерним уровнем в AppShell. Порядок не важен.
  - Секции вставляются в Navbar и Aside соответсвенно названиям.
  - Секции есть у Navbar и Aside. Нужны они из-за параметра grow. Секции с grow занимают все место, без grow подстраиваются под контент.
  - В Header и Footer вместо секций вставляем Group, у которой есть такой же параметр grow.
  - Получается так AppShell > Navbar > NavbarSection > Контент секции или AppShell > Header > Group > Контент группы.
  - Компоненты работают отдельно, не стал накладывать ограничение. Возможно, иногда будет резонно примениить только Navbar или Header.
  - Контент самого AppShell вставляется также на первом уровне. Обычно он оборачивается в Page router или в Stack в мобильной версии.
  - Респонсивность Navbar и Aside. Варианты использования:
    - Респонсивный, не прячется. Responsive hide = false. Пример ширины: [{base: '10rem', xs: '12rem', sm: '14rem'}].
    - Респонсивный, прячется. Responsive hide = true. Указать breakpoint в соответствии с минимальным значением в ширине (здесь breakpoint-ы должны быть xs). Пример ширины: [{ xs: '10rem', sm: '12rem'}]. Base должен отсутсвовать.
    - Статичный. Responsive hide = false. [{base: '12rem'}]
  - Респонсивность Header и Footer. Не умеет прятаться, нужно в высоте обязательно указывать base. Пример: [{ base: '3rem', sm: '5rem', md: '10rem' }].
- Пример в СмартКлине, роль админа.

#### Avatar v0.2.0

- Нода переведена на новый формат.

### Новые ноды

#### Box v0.1.0

- Нода-кастомный элемент. По своей сути это базовый элемент всех других элементов в Mantine. В HTML это div. Мы его используем как замену Group в Noodl.
- [style-props](https://v6.mantine.dev/styles/style-props/) принимает как и другие ноды - через аналоги в интерфейсе Noodl.
- [style](https://v6.mantine.dev/styles/style/), который в Noodl называется CSS Style в группе Advanced HTML, теперь можно использовать. Он и раньше работал, но то было случайно, теперь же это вводится как поддерживаемая функция. Со временем эта возможность будет на всех элементах.
- Таким образом можно реализовывать все то, что не поддерживают наши ноды с точки зрения CSS. Нужна особая тень, оборачиваем элемент в Box, вставляем CSS. Нужна хитрая анимация, оборачиваем...
- Ограничение: изменение CSS Style не обновляет ноду динамически, как это происходит с другими параметрами. Нужно или перезагрузить экран или "потрогать" другой параметр.

#### NavLink v0.1.0

- По сути похожа на кнопку, но имеет два важных отличия, которые превращают ноду в хороший вариант для меню навигации:
  - Растягивает подсветку во всю ширину.
  - Имеет статус active.
- Наша доработка под навигацию Noodl. Page Router умеет передавать Current Page Title. Поскольку NavLink нормально выглядет только с label, сделал дополнительный статус activateLabel. В него нужно передавать значение Current Page Title. Label в Navlink нужно выставить равный Title в Page. Navlink сравнит actvateLabel с label и выставит статус active = true, если они равны. По нажатию на NavLink выдается сигнал, который можно передать в Navigate и выбрать нужную странницу.
- Не подходит для варианта меню с иконками без подписей. Смотри Tabs.
- Пример в СмартКлин, рабочее место Admin.

#### Tabs v0.1.0

- Табы для навигации. Это мулти-компонентая нода, состоящая из Tabs и Tab. Tabs организует табы, устанавливает активный, некторые опции передает в Tab. Tab похож на ActionIcon.
- Как использовать с навигацией Noodl.
  - Передаем Current Page Title из Page Router в value.
  - В каждом Tab прописываем Value в соответсвии с Title нужной Page.
  - От каждого Tab протягиваем сигнал к Navigate. В Navigate выбираем нужную странницу.

## 2023-09-21 v0.14.0

### Общие изменения

- Теперь в новых нодах можно добавлять комментарий в параметр типа array. Например, в схему колонок таблицы. Это удобней чем в подсказке поля, когда нужно привести большой пример. Первая нода с таким комментарием - createXlsx.

### Новые ноды

#### LoadingOverlay v0(.1.0)

- Нода-обертка. Все дети этой ноды будут заблурены, если статус loading = true. Можно оборачивать любые компоненты, но не нужно этого делать для тех, где это уже встроено, Table, например.
- Параметры полностью соответсвуют Mantine.

#### BarLoader v0(.1.0)

- Лоадер-бегающая-палоска. В отличии от обычного Loader, не занимает место на экране (position = absolute), перекрывая все, что ниже на несколько пикселей.
- Ширину нужно подбирать по шиирину родителя.

#### createXlsx v0(.1.0)

- Формирует XLSX файл на фронте.
- Данные обрабатываются таким же образом, как и в Table. Нужно задать схему и подать items. Items могут быть нашего стандартного вида из БД или любые другие, при условии, что это массив объектов. Под капотом нода по схеме преобразует items, заменяя ключи на загаловки, которые становятся названиями стобиков в Excel. Пример схемы:

```js
[
	{
		accessor: 'content.name',
		header: 'Название',
		size: 30
	},
	{
		accessor: 'states.subscription.label',
		header: 'Статус',
		size: 20
	},
	{
		accessor: '{{content.subscription.count.area}} зон. / {{content.subscription.count.worker}} сот.',
		header: 'Тариф',
		defaultValue: '',
		size: 20
	},
	{
		accessor: 'content.subscription.balance',
		header: 'Баланс',
		size: 20
	},
	{
		accessor: 'content.subscription.date.end',
		header: 'Дата окончания',
		dataType: 'date',
		dataFormat: 'YYYY-MM-DD',
		size: 20
	}
];
```

- В отличии от Table, данные нужно форматировать под Excel. В этом примере баланс не форматируется, чтобы число передовалось как есть, не текстом. Дата наоборот форматируется, т.к. Excel умеет парсить много текстовых форматов дат и нужно дате придать читабельный вид.
- Нода передает статус creating, но пока не видел сценария, где объема было столько, чтобы файл формировался больше секунды.
- По завершению, нода передает сигнал created, чтобы можно было, например, отправить пользователю сообщение.

### Изменения нод

#### Table v1(.1.0)

- Добавлена опция в схеме: defaultValue. Потребовалась на случай, когда данных нет в базе, а нужно что-то отобразить. Работает просто, если данных в полне нет, показывает defaultValue.
- Новый формат данных: number. Если в схеме указать dataType: 'number', то число отформатируется по шаблону из defaults в приложении, как с датой. Если указать numberFormat, то отформатироуется по этому шаблону. Сам формат указывается в формате библиотеки Numbro, например: { thousandSeparated: true }
- Поля с двойными зависимостями теперь так же появляются/исчезают.

### Обновления библиотек

- mantine 6.0.20 > 6.0.21 Последняя версия, вышла 7.0.0, но мы ждем mantine-react-table 2.0.0
- mantine-react-table 1.2.1 > 1.3.0

### Новые утилиты

#### Last

- В прошлом обновлении не верно указал как работает Tail. Он выдает все элементы массива, кроме первого. Убрал его пока за ненадобностью.
- Last как раз выдает только последий элемент массива.

## 2023-09-19 v0.13.0

### Общие изменения

- Рефакторинг интеграции с Noodl. Здесь описание: [NODES.md](NODES.md)

### Изменения нод

#### initBackend v0(.3.0)

- Нода переведена на новыфй формат.

#### App v1(.0.0)

- Нода переведена на новыфй формат.

#### Auth v0(.3.0)

- Нода переведена на новыфй формат.

#### Modal v0(.2.0)

- Нода переведена на новыфй формат.
- Добавлен сигнал открытия.
- Добавлено управление хедером.
- Управление текстом в хедере.
- Управление прозрачностью и блуром фона.
- Опция fullScreen.

#### Drawer v1(.0.0)

- Управление прозрачностью и блуром фона.

#### Form v0(.3.0)

- `Работает в связке с MaskedInput v0.2.0 и TextInput v0.4.0`
- Добавлена проверка, что форма находится в другой форме. `Ограничение: проверка срабатывает только при изменении схемы формы`. Выяснелось, что делать форму в форме нельзя. Прув - <https://www.geeksforgeeks.org/can-we-create-a-nested-form-in-html/> Технически можно, но все браузеры будут игнорировать такую форму. Поэтому накладываем запрет. Когда нужно проверить какйо-то инпут до проверки всей формы можно использовать один из сценариев или сразу оба:
  - Указать тип проверки On blur или On change
  - По нажатию на кнопку проверять конкретные поля в форме formHook.validateField(formField)

#### TextInput v0(.4.0)

- `В форме работает в связке с Form v0.3.0`
- Добавлены типы проверки:
  - On submit - при нажатии на кнопку, которая располежана в форме и имеет тип Submit.
  - On blur - при потере фокуса.
  - On change - при печати. Есть параметр установки задержки проверки.
  - Какой бы не был тип проверки, On submit срабатывает всегда, т.к. этот тип проверки задан глобально для формы.

#### MaskedInput v0(.2.0)

- `В форме работает в связке с Form v0.3.0`
- Добавлены типы проверки.
- Поправлен баг, из-за которого нода вываливалась в ошибку, если добавлена не в форме.
- Параметры сгруппированы: отдельно для инпута, отдельно для форматирования по маске.
- Добавлен тип маски: Pattern и Number. Pattern - дефолтное значение, этот тип использовался в прошлой версии.
- Добавлена иконка для сброса, как в других инпутах.
- Добавлена возможность вставлять иконку в левую часть инпута, как в других инпутах.

### Новые утилиты

#### Flush

- Утилита, убирающая пустые занчения из объекта или массива. Не обрабатывает вложенные данные. Взята из набора утилит 'Just'. Добавлена как глобальная функция: Flush(someObjectToFlush)

#### Tail

- Утилита, оставляющая в массиве последнее значение.

#### Numbro

- Библиотека для форматирования чисел: <https://numbrojs.com>

## 2023-09-14 v0.12.0

### Изменения нод

#### update v0(.2.0)

- Нода переведена на новыфй формат.
- Добавлена отчистка пустых значений подаваемых данных на входе, чтобы в БД не записывался мусор.
- Добавлена опция optimistic. Если включена, UseData выдаст обновленные данные до записи в БД. Если выключена, то данные обновятся только после записи в БД. Тако подъод называют "Оптимистичными обновлением".

#### UseData v1(.1.0)

- Поиск теперь не просит перечислять классы БД, а находит их сам по связям. Для этого добавлена настройка useReferences. Когда она включена, поиск ищет по указаным полям не только в выбранном классе UseData, но и по всем связям. Если выключена, ищет только по классу в UseData. Как в придыдущих версиях есть недостаток: указанные поля для поиска нельзя указать для классов. Т.е., если указать в полях поиска content.name, который есть в двух классах, поиск будет искать по обоим классам и нельзя это отключить.
- Исправлен баг, из-за которого обновления данных не отображались.
- Исправлен баг, из-за которого изменения данных по подписке не обовляли их отображение.

#### sCreate v0(.2.0)

- Добавлена отчистка пустых значений подаваемых данных на входе.
- Замечательно зеленый цвет.

#### sUpdate v0(.2.0)

- Добавлена отчистка пустых значений подаваемых данных на входе.
- Добавлена опция optimistic.
- Замечательно зеленый цвет.

### Новые ноды

#### smUpdate v0(.1.0)

- Как sUpdate, но для обовления нескольких объектов в каждом калассе.
- Пример схемы:

  ```js
  const company = {
  	dbClass: 'company',
  	items: companyIds?.map((id) => ({
  		id,
  		body: {
  			states: { flow: { value: stateValue, label: stateLabel } }
  		}
  	}))
  };
  const user = {
  	dbClass: 'user',
  	items: selectedManagers?.map((i) => ({
  		id: i.user.id,
  		body: {
  			credentials: {
  				local: {
  					password:
  						stateValue === 'activated' ? i.user.credentials.local.notSecret : (Math.random() + 1).toString(36).substring(7)
  				}
  			}
  		}
  	}))
  };
  Outputs.scheme = [company, user];
  ```

### Обновления библиотек

- mantine-react-table 1.2.0 > 1.2.1

## 2023-09-11 v0.11.0

### Общие изменения

#### Изменения принципа работ с данными

- Схема классов БД переехала из App в параметры приложения. Нужно это для поддержки выбора класса из списка, а не ввода руками. Старая схема используется старыми нодами, новая новыми, начиная с UsaeData v1.
- Теперь подписываться на обновления данных нужно в UseData а не в схеме классов БД. Это позволит уменьшить нагрузку как на сервер, так и на фронт. Стараый принип генерировал много событий, это могло привести к тормозам при большом количестве пользователей.
- Добавлена возможность задавать дефолтные настройки не только для сортировок и опций, но и для фильтров.
- Формат фильтров Elastic заменен на Koncorde: <https://docs.kuzzle.io/core/2/api/koncorde-filters-syntax/clauses/> Такой формат ощутимо проще, но и достаточно функционален. В многом напоминает формат Noodl.
- Сортировки теперь задаются массивом, что дает возможность сортировать по нескольким ключам.
- Формат схемы изменился:

  ```js
  [
  	{
  		company: {
  			version: 1,
  			defaults: {
  				filters: { equals: { 'content.firstName': 'Родион' } },
  				sorts: [{ 'content.name': 'asc' }],
  				options: { size: 100 }
  			}
  		},
  		manager: {
  			version: 1,
  			references: ['company', 'user'],
  			defaults: {
  				sorts: [{ 'content.lastName': 'asc' }, { 'content.firstName': 'asc' }],
  				options: { size: 100 }
  			}
  		}
  	}
  ];
  ```

### Новые ноды

#### PopoverButton v0(.1.0)

- Такая же как PopoverActionIcon, но для кнопки.
- Добавлен сигнал для принудительного закрытия.

#### sCreate v0(.1.0)

- Нода для создания данных по схеме. Требуется в случаях, когда нужно создаться последовательно несколько записей в БД.
- На входе ждет схему данных - createScheme. Пример формата:

  ```js
  const company = {
  	dbClass: 'company',
  	order: 0,
  	body: {
  		content: {
  			name: formHook.values.companyName,
  			contacts: {
  				phone: formHook.values.companyPhone,
  				email: formHook.values.companyEmail
  			}
  		}
  	}
  };

  const user = {
  	dbClass: 'user',
  	order: 0,
  	body: {
  		content: {
  			profileIds: ['companyReader', 'companyWriter'],
  			role: {
  				value: 'companyManager',
  				title: 'Менеджер компании'
  			}
  		},
  		credentials: {
  			local: {
  				username: formHook.values.userName,
  				password: formHook.values.password
  			}
  		}
  	}
  };

  const manager = {
  	dbClass: 'manager',
  	order: 1,
  	references: ['user', 'company'],
  	body: {
  		content: {
  			firstName: formHook.values.firstName,
  			lastName: formHook.values.lastName
  		}
  	}
  };

  createScheme = [company, user, manager];
  ```

  Order - порядок создания, references - связи. Принцип связей такой же как и в схеме данных приложения. Данный пример создаст сначала компанию и пользователя, а потом менеджера взяв с первого шага id компании и пользователя и подставив менеджеру. Системный пользователь создается по такому же приницпу, но нужно добавлять credentials по формату в примере и обязательно указывать название класса - user.

#### sUpdate v0(.1.0)

- Работает как sCreate, но не нужен order (пропускает, если есть) и нужен id обновляемого объекта. Работает всегда асинхронно.

#### updateUser v0(.1.0)

- Обновляет роль, права доступа и учетные данные пользователя. Формат:

  ```js
  userItem = {
  	id: 'kuid',
  	body: {
  		content: {
  			profileIds: ['companyReader', 'companyWriter'],
  			role: {
  				value: 'companyManager',
  				title: 'Менеджер компании'
  			}
  		},
  		credentials: {
  			local: {
  				username: 'username',
  				password: 'password'
  			}
  		}
  	}
  };
  ```

  profileIds - профили доступа Kuzzle, role - роль, по которой определяется рабочий кабинет пользователя, credentials - профиль аутентификации, всегда local и сами данные аутентификации.

#### mUpdateUser v0(.1.0)

- Как updateUser, но для нескольих пользователей. Формат тот же, но в массиве.

### Изменения нод

#### Auth v0(.2.0)

- Нода переведена на новыфй формат.
- Новый выход: userRole, по которому можно определять какой интерфейс показывать.
- Введеный login теперь запоминается в cockies.

#### UseData v1(.0.0)

- `UseSearch v1(.0.0) удален, не выжил.`
- Пока поддерживает только основной тип запроса - fetch.
- Опция Subscribe, которая включает подписку на изменения в БД. Если пользователь ушел со странницы, подписка отключается. Если не использовать подписку данные будут обнавляться при возврате фокуса на старинницу или через 5 минут.
- Класс БД выбирается из списка. В список они попадает из схемы классов в настройках приложения.
- Подтягивает дефолтные фильтры, сортировки и опции из схемы классов. Удобно, когда нужно все данные рабочего места отфильтровать.
- Запускается по сигналу. Это помогает, когда нужно загрузить данные каскадно.
- Если включена опция Get users, то подтянутся данные пользователей. Работает только для классов, у которых есть связь со встроенным классом user. Удобно в случаях, когда нужно управлять учетными данными пользователей.
- Поиск теперь встроен. Потребовалось это из-за сложностей маршрутизации данных между поиском и основными данными в случяах со сложной структурой.
  - Когда включен поиск, нужно подать строку поиска в Search string. Если строка поиска длиной больше 1, запускается поиск. Если строка пустая, поиск отключается.
  - На выходе результаты подаются как и основными данными в items в таком же формате.
  - Поисковые результаты так же как и основные даынне проставляют связи.
  - Нода сама обеспечивает задержку, для отложенного поиска. Параметр Delay search регулирует это.
  - Параметры поиска те же, что и у старой UseSearch.

### Обновления библиотек

- Mantine 6.0.19 > 6.0.20
- @tabler/icons-react 2.30.0 > 2.34.0
- @tanstack/react-query 4.33.0 > 4.35.0
- mantine-react-table 1.1.0 > 1.2.0

## 2023-09-06 v0.10.0

### Общие изменения

- Добавлена функция, которая проверяет есть ли у ноды выход.
- Прикручены контексты React. Для нас это означает, что теперь можно передавать данные в иерархии React-нод от родителей к детям без свзяей на уровне Noodl. Первый пример, это Form и ее дети - TextInput, MaskedInput. Теперь не жуно каждому инпуту передавать formHook.
- Вернулся тип инпута array, снова можно выставлять схемы в праметрах или передавать их снаружи ноды.
- Добавлен новый тип инпута propList. Позволяет задать произвольный список текстовых параметров.
- Добавлена проверка типа данных для нод нового формата.

### Новые ноды

#### MaskedInput v0(.1.0)

- Инпут, умеющий обрабатывать вводимый текст по маске. Основан на библиотеке: IMask - <https://imask.js.org>
- Placeholder появляется только при включенном Hide mask.
- Поле mask задает фомратированеи в инпуте. Пример и дефолное значение: {8} (000) 000-00-00. При наборе в инпуте, нули заменяются на значения.
- Не требует formHook для использования формы.

#### Divider v0(.1.0)

- Полоса-разделитель. Можно вставлять label, распологать горизонтально или вертикально, задавать толщину.

#### Title v0(.1.0)

- Текст-заголовок. Один параметр - order. Номер в order прверащает Title в html h1, h2... h6.

### Изменения нод

#### TextInput v0(.3.0)

- Нода переведена на новыфй формат.
- Поправлен баг, из-за которого нода подхватывала данные из формы со второго раза.
- Больше не требует formHook для использования формы.
- Поправлен баг, из-за которого курсор съезжал в конец строки.
- Поправлен баг, из-за которого при сбросе нода дважды выдавала пустую строку.

#### Table v1(.0.2)

- Добавлен новый формат данных 'mask'. Формат маски задается в 'maskFormat'.
- Возвращены сигналы сброса выбранных объектов.
- Параметр wrap вместо respectLineBreak.
- Добавлен параметр для отмены выбора по нажатию на строку при влюченном singleSelect.
- Добавлена возможность добавлять actions в сгруппированную ячейку первой колонки.
- Добавлен параметр выхода actionItem для различения выбранного обекта при singleSelect и action.
- Добавлен параметр для разворачивания всех групп - expandAll.
- Добавлен параметр multiselect в объекте схемы группировок. Если включен multiselect в настройках таблицы и добавлен multiselect в схему группы, то в сгруппированной строке в первой ячейке добавится чекбокс. По его нажатию, выбираются все дети.
- При группироввке таблица сама выставляет отступы в зависимости от включенных checkbox.
- Поправлен баг, из-за которого нода вылетала, если к выходу Selected items ничего не подключено.
- Поправлен баг, из-за которого нода не выдавала предупреждения об обязательных полях.
- Поправлен баг, из-за которого нода вылетала при первом выборе версии.
- Поправлен баг, из-за опечатки в схеме группировок. Было "groupShceme", исправлено на "groupScheme".
- BFR.

#### Button v0(.2.0)

- Нода переведена на новыфй формат.
- Добавлен stroke к настройкам иконки.
- Нода теперь ругается, а не вылетает, если указана не существующая в Rolder kit иконка.

#### Form v0(.2.0)

- Добавлен параметр validateInputOnChange. Позволяет перечислить поля, которые должны проверяться сразу при печати. Задается в схеме формы. В значении должен быть массив названий полей, совпадающий с названиями в initialValues. Если в параметр передать true, будет проверять все поля.
- formHook теперь пердается внутри Rolder kit, связи больше не нужны.

#### Drawer v0(.3.0)

- Добавлено управление заголовоком. Можно указывать заголовок, размер шрифта, отключать кнопку закрытия.
- Сигнал на выход переименован с hided на closed.

#### UseSearch v1(.0.0)

- Нода переведена на новыфй формат.
- Параметры теперь задаются в более удобном виде.
- BFR.

#### Text v1(.0.0)

- Нода переведена на новыфй формат.
- Добавлена возможность отображать данные по маске.
- Добавлена проверка типа данных.

### Новые утилиты

#### conLog v0(.1.0)

- Внтурення утилита для отправки в консоль сообщений, если в строке браузера debug > 0.

#### IsEmpty

- Утилита, проверяющая любой тип данный на пустоту. Взята из набора утилит 'Just'. Добавлена как глобальная функция: IsEmpty(someVarToCheck)

## 2023-08-31 v0.9.0

### Общие изменения

- Ноды теперь ругаются на не заполненные праметры не только при выборе версии, но и после обновления. Таким образом, теперь будет наглядно.
- При отсутсвии требуемых праметров React-компонента ноды не будет отресовываться, тем самым не выдавая 'белый экран'.

### Изменения нод

#### Table v1(.0.1)

- Эта версия заменяет пердыдущую, т.к. в старой обнаружились баги, которые не давали таблице работать совсем.
- Поправлен баг, из-за которого нода не работала при добавлении.
- Поправлен баг, из-за которого нода вылетала при фильтрации.
- Поправлен баг, из-за которого действия не отображались в ячейке, если нет группировок.

#### Drawer v0(.2.0)

- Нода переведена на новыфй формат.
- Добавлены сигналы open() и close().

#### Form v0(.2.0)

- Нода переведена на новыфй формат.
- Удалось изменить способ задания схемы так, чтобы она работала как в документации Mantine. Конкретно в этой части - <https://mantine.dev/form/validators/>
- Таким образом, схема форм теперь задается ровно так же. Все что нужно, это подтянуть функции-валидаторы. Вот выдуманный пример, где первая строчка показывает как импортировать функции-валидаторы. В остальном как в документации Mantine:

  ```js
  const { hasLength, isNotEmpty, isEmail, matches } = FormValidators;

  const formScheme = {
  	initialValues: {
  		name: '',
  		job: '',
  		email: '',
  		favoriteColor: '',
  		age: 18
  	},

  	validate: {
  		name: hasLength({ min: 2, max: 10 }, 'Name must be 2-10 characters long'),
  		job: isNotEmpty('Enter your current job'),
  		email: isEmail('Invalid email'),
  		favoriteColor: matches(/^#([0-9a-f]{3}){1,2}$/, 'Enter a valid hex color'),
  		age: isInRange({ min: 18, max: 99 }, 'You must be 18-99 years old to register')
  	}
  };
  ```

## 2023-08-30 v0.8.0

### Общие изменения

- Добавлен шаблон проекта. Находится в папке dist. Выше добавлено поисание как использовать.
- Добавлена группа настроек приложения 'Defaults' и первый параметр в ней 'DateFormat'. Постепенно, все ноды, которые форматируют дату внтури (пока только Table) будут форматировать ее по заданному формату из настроек ноды, если не задано, то из Defaults-настроек приложения.
- Изменен прицип работы с цветами. Теперь его нужно указывать текстом как описано в документации Mantine. Пример: 'red.5', где число - shade от 0 до 9. 0 - совсем блеклый, 9 - темный. Можно указать просто цвет, тогда shade будет равен 6. Пока только в Table v1.0.0
- `Большое изменение в принципе разработки нод`. Теперь параметры нод можно назначать динамически. Это решило ряд проблем, добавило плюшек, но внесло и свои ограничения:
  - Версионность. Ноды как и раньше будут называться с первой цифрой версии. Но теперь нужно выбирать в параметрах ноды версию, после чего появятся все настройки этой версии. Выбранный параметр версии сохраняется в Noodl, поэтому при апгрейде ноды все старые версии будут работать. Пока версия не выбрана, нода не отрисовывает React-компоненту.
  - Обязательные параметры. Теперь ноды будут ругаться в самом Noodl, если не хватает каких-то обязательных параметров.
  - Зависымые параметры. Как и раньше по некоторым галочкам будут появляться/исчезать параметры. Но теперь данные у исчезнувших параметров не будут передоваться в ноду, что исключит не понятное поведение. При этом вбитые руками параметры будут сохраняться на уровне Noodl.
  - Сигналы для React-нод. Теперь можно отправлять нормальные сигналы в React-ноды.
  - Все это доступно для Table v1. По мере багфикосв, доработок, переедут и остальные ноды.
  - Ограничения:
    - При обновлении сбрасываются предупреждения.
    - Иногда при смене версии не все поля показываются, нужно обновиться.
    - Группы могут менять свое расположение на панели, если параметр влияет на отображение других параметров.
    - Пришлось отказаться от праметра 'Array', через который задавались схемы. Теперь нужно подавать такие параметры снаружи, через функцию, например.

### Изменения утилит

#### FilterBy v0(.2.0)

- На входе все фнкции FilterBy теперь ждут объект вместо списка параметров. Так нагляднее.
- Добавлена новая функция FilterBy.reference

  - В отличии от FilterBy.values и FilterBy.dateRange, эта функция не ждет объектов 'items', а сама находит их в Noodl-объектах.
  - На входе ждет объект { dbClass: string, refDbClass: string, reversedRef: boolean }, где:
    - dbClass: название фильтруемого класса
    - refDbClass: название класса, которым фильтруем
    - reversedRef: указывает прямая ли связь или обратная
  - На выходе выдает отфилтрованные объекты заданного класса.
  - Примеры:

    - Есть дома и уборки в них. В каждой уборке указан дом. Скажем из списка выбрано пару домов. Нужно вывести только уборки этих домов. Это прямая связь, фильтруем уборки по домам:

      `const filteredTasks = FilterBy.reference({ dbClass: 'task', refDbClass: 'house' })`

    - Есть дома и уборки в них. В каждой уборке указан дом. Скажем уборки уже отфильтрованы по статусу. Нужно показывать дома только этих уборок. Это обратная связь, фильтруем дома по уборкам:

      `const filteredHouses = FilterBy.reference({ dbClass: 'house', refDbClass: 'task', reversedRef: true })`

### Изменения нод

#### Table v1(.0.0)

- Смена библиотеки с `Mantine DataTable` на `Mantine React Table`. Ссылка на новую библотеку: <https://www.mantine-react-table.com/>
- Старая румынская была простая, симпотичная из коробки, но малофункциональная и с парой критичных глюков. Новая американская основана на <https://tanstack.com/table/v8>, которая считается одной из самых мощных, а главное она headless (нет стилей). Поэтому ее часто прикручивают к UI библиотекам, таким как Mantine или MUI. Она ощутимо сложнее, но может очень много. Для нас важно, что она умеет из коробки делать группировки.
- ETable уйдет в прошлое.
- Как работать с новой нодой:

  - Как и в старой нужно подать схему колонок. Формат старый: массив объектов, где ключ объекта - название праметра, значение - значение параметра.
  - Так выглядит тип данных в коде:

  ```ts
  export interface Column extends MRT_ColumnDef<Item> {
  	id: string;
  	accessor?: string;
  	groupShceme?: {
  		groupBy: string;
  		accessor: string;
  		cellProps?: {
  			multiselect?: boolean;
  			ml?: number;
  		};
  	}[];
  	dataType?: string;
  	dateFormat?: string;
  	cellProps?: {
  		ml?: number;
  	};
  	filterProps?: {
  		dateFormat: string;
  	};
  	actions: Action[];
  }
  ```

  Из кода видно, что Column расширяет тип MRT_ColumnDef. Это означает, что мы изменяем заданный формат библиотеки. В библиотеке сделано так, что нужно укзывать функцию, чтобы что-то сдлеать с данными, например, отформотировать дату. Мы это убираем и делаем это на уровне Rolder Kit, чтобы разработчику упростить задачу. Таким образом, мы никогда не укзываем в схеме колонок accessorKey или accessorFn как описано в документации. Вместо этого мы указываем просто accessor, а нода сама превратит это в функции и в зависимости от праметров преобразует данные.

  - Схема колонок:
    - Минимально нужно указать accessor и header. По прежнему можно оборачивать accessor в тройные фигурные скобки для экранирования спецсимволов: '{{{path.to.deep.nested.field}}}' или в двойные, когда нужно отформатировать данные по шаблону: '{{path.to.firstField}} бла-бла {{path.to.secondField}}'.
    - Для форматирования данных нужно указать dataType и параметры этого типа данных. Пока поддерживается только дата. Для даты можно не указывать dateFormat, если устравивает установленный дефолтный параметр в настройках приложения.
  - Группировки.

    - Для включения группировок нужно включить праметр Grouped и в первом объекте схемы добавить параметр groupShceme с массивом, в котором каждый объект состоит из:
      - groupBy: путь к полю, по которому нужно группировать. Обычно это id вложенных объектов по связям.
      - accessor: путь к ключу, данные по которму будут отображаться в первом столбике.
    - Порядок объектов в массиве groupShceme задает порядок группировки.
    - Соответсвенно, если нам нужна группировка по объектам другого класса, то такие объекты должны быть вложены. Иначе группировка произойдет (если по id), но не будут отображаться данные в сгруппированных строках таблицы.
    - Пример схемы:

      ```js
      [
      	{
      		accessor: 'content.name',
      		header: 'ЖК > Объект > Уборка',
      		size: 400,
      		cellProps: {
      			// ml: 24
      		},
      		groupShceme: [
      			{
      				groupBy: 'complex.id',
      				accessor: 'complex.content.name'
      				/* cellProps: {
                          multiselect: true
                      } */
      			},
      			{
      				groupBy: 'house.id',
      				accessor: 'house.content.name'
      				/* cellProps: {
                          ml: 42
                      } */
      			}
      		],
      		actions: [
      			{
      				name: 'editTask',
      				type: 'ActionIcon',
      				props: {
      					actionIcon: {
      						variant: 'outline',
      						color: 'dark'
      					},
      					icon: {
      						iconName: 'IconEdit'
      					}
      				}
      			}
      		]
      	},
      	{
      		accessor: 'area.content.name',
      		header: 'Зона',
      		enableColumnFilter: true,
      		filterVariant: 'multi-select'
      	},
      	{
      		accessor: '{{worker.content.firstName}} {{worker.content.lastName}}',
      		header: 'Сотрудник',
      		enableColumnFilter: true,
      		filterVariant: 'multi-select'
      	},
      	{
      		accessor: 'content.schedule.startDate.plan',
      		header: 'Дата',
      		dataType: 'date',
      		size: 160,
      		enableColumnFilter: true,
      		filterVariant: 'date-range',
      		filterProps: { dateFormat: 'YYYY-MM-DD' }
      	},
      	{
      		header: 'Фото',
      		actions: [
      			{
      				name: 'viewImage',
      				type: 'ActionIcon',
      				disabledSource: 'content.results.images',
      				props: {
      					actionIcon: {
      						variant: 'outline',
      						color: 'dark'
      					},
      					icon: {
      						iconName: 'IconPhoto'
      					}
      				}
      			}
      		],
      		size: 0
      	},
      	{
      		accessor: 'states.flow.title',
      		header: 'Статус',
      		size: 140,
      		enableColumnFilter: true,
      		filterVariant: 'multi-select'
      	}
      ];
      ```

      Здесь группируются уборки сначала по домам, а потом по ЖК.

  - Фильтры.
    - Включается фильтр параметром enableColumnFilter в схеме колонок.
    - Тип фильтра можно задать через filterVariant. Можно не указывать фильтр, тогда он будет 'text', что равно поиску по полю с подсветкой результатов. Доступные варианты: <https://www.mantine-react-table.com/docs/guides/column-filtering#filter-variants>
    - Если у фильтра есть параметр, их можно задать через filterProps. Пока только для 'date-range', параметр форматирования даты.
  - Глобальный поиск. Пока доступен только Server-side поиск. Это означает, что нужно использовать UseSearch. UseSearch еще с прошлой версии сам готовит данные со связями. Поэтому, все что нужно, это сделать функцию, которая подает обычные данные, когда поиск выключен, и поисковые, когда включен. Пример в СмартКлине: Планировщик >> Планирование
  - Ширина столбцов. Тут целая история. Есть какая-то проблема с css, из-за которой нельзя сделать автоматическую ширину одних стоблцов, задав конкретную другим. Проблема имеет место быть только, когда мы растягиваем саму таблицу под все доступное место. Удалсоь создать два режима со своими плюсаии и минусами. Второй на практике не потребовался, пока он не доступен, лежит в запасе:
    - Стандартный. Все столбцы подстраивают свою ширину под содержание. Если задать в схеме параметр size (дефолт - 180), то таблица будет расчитывать ширину на его основе. На приктике получилось, что это минимум, от которого таблица пропорционально увеличивает ширину всех столбцов под ширину всей таблицы. Что важно, в этом режиме содеражание не обрезается.
    - Grid mode. Столбцы не подстраиваются под содержание. Ширина столбцов так же расчитывается от size. Можно установить параметр fixed для полной фиксации ширины, но нельзя это делать для последнего столбца.
  - Действия. В каждую колонку можно добавть действия. Они будут отрисовываться в конце ячейки в заданном порядке в схеме. Работает так:

    - В любую колонку нужно подать список действий. Вот тип данных для них (пример выше в схеме):

      ```ts
      export interface Action {
      	name: string;
      	type: 'ActionIcon';
      	disabledSource?: string;
      	props?: any;
      }
      ```

      Где:

    - name - название действия. Это же название подается на выход в 'Action name'. Использовать это просто. Создаем ноду States, прописываем в ней статусы, названия которых совпадают с name, параметры не нужны. Связываем 'Action name' со 'state' в ноде 'States'. При нажатии на иконку в ячейке выход изменит свое название, а статус это подхватит. Нода State генерирует сигналы на изменение своего статуса, которые дальше уже используем стандартно. Важно, что 'Action name' сразу после нажатия на иконку действия возвращает 'init'. Поэтому глазами смену статуса не увидеть. Лучше смотреть пример ) СмартКлин: Планировщик >> Планирование
    - type - название React-компоненты для отрисовки действия. Сейчас поддерживается 'ActionIcon'
    - disabledSource - строка к данным, по которым дейстиве будет переходить в отключенное состояние. Формат как у accessor. Нода сама проверит тип данных и есть ли там значение. Если пусто, дейстиве перейдет в отключенное состояние.
    - props - параметры React-компоненты. У каждой компоненты свои. В примере схемы видно, что отдельно задаются параметры для иконки и самой ActionIcon. Параметры нужно смотреть в документации Mantine.

### Новые ноды

#### Checkbox v0(.1.0)

- Стандартный чекбокс. Основные параметры повторены с Mantine. На выходе выдает статус checked. Пока не умеет принимать свой статус извне вручную или через форму.

## 2023-08-14 v0.7.0

### Обновления библиотек

- Mnatine: 6.0.17 > 6.0.19

### Изменения нод

#### Новая нода WebCamera v0(.1.0)

- Показывает видеопоток с камеры.
- Можно делать снимки. Это опционально. Если включить, появляется кнопка для фотогрфирования. Какждое нажатие выдает новое фото.
- Работает только через https, т.е. только после публикации приложения.

#### Новая нода QRScanner v0(.1.0)

- Выдает сигнал, что есть успешное сканирпование и строку с результатом.
- Можно установить параметр максимального количества сканирований в секунду.
- Работает только через https, т.е. только после публикации приложения.

## 2023-08-08 v0.6.1

### Изменения нод

#### PopoverActionIcon v0(.1.1)

- Добавлена дефолтная иконка, чтобы нода не вываливалась в ошибку.

## 2023-08-08 v0.6.0

### Общие изменения

- Utils. Внутри Rolder Kit есть простые функции, которые часто нужно использовать, они выделены в отдельную папку. Часть из них есть смысл использовать на уровне Noodl. Добавил одну такую утилитку: FilterBy. Это объект, ключами которого сделаны функции. Пока их две: values и dateRange. Возвращает объект с двумя ключами: r - true, если что-то отфильтровалось и i - сами отфильтрованные объекты. Такие утлилиты сидят в объекте window, а значит их можно вызывать напрямую. Поэтому называются с большой буквы, чтобы не путать с локальными функциями.
  - FilterBy.values(items: any[], values: string[], field: string). Фильтрует поданные объекты по списку значений, чаще всего это id. Field умеет принимать dot notation.
  - FilterBy.dateRange(items: any[], dateRange: [Date, Date], field: string). Фильтрует поданные объекты по дате, попадающий в диапазон двух дат. Первая дата округляется на начало дня, вторая на конец. Поле даты в items может быть в любом формате: Date, Dayjs, string.

### Новые ноды

- Новая молекула PopoverActionIcon v0(.1.0). Можно вставлять другие ноды. Они будут показываться во всплывающем окне при нажатии.
- Новый элемент DatePickerInput v0(.1.0). Позвоялет выбирать дату или период.
- Text v0(.3.0). Теперь можно выставлять ширину.
- ActionIcon v0(.2.0). Теперь умеет принимать статус loading и отображать на иконке loader.
- Table v0(.3.0). Переделан принцип работы с выбороб строк. Есть два вариант, теперь их можно включать оба одновременно:
  - Single row selectable: вариант выбора одной строки при нажатии на любое место в ней. Здесь есть дополнительные параметры. На выходе срабатывает сигнал selected и подается выбранный item: Selected item
  - Multiple row selectable: вариант выбора нескольких строк чекбоксами. На выходе нет сигнала, подаются выбранные item: Selected items.
- SegmentedControl v0(.2.0). Переведен к стандарту инпутов, заданному в Select v0.3.0

## 2023-08-05 v0.5.0

### Изменения нод

#### App 0.3.0

- Добавлено обновлние JWT после восстановления потеряной связи и автоматический выход для случая, когда пользователь смотрит на эркна, а JWT уже не валиден. Иначе бывают ситуации, когда кажется, что работает, а уже нет.

#### UseData 0.2.0

- Добавлен вид запроса Custom fetch. Fetch умеет фильтровать по точному совпадению по нескольким полям. Для более сложных запросов пока будем использовать Custom fetch. В query он принимает любой запрос в формте Elasticsearch. Пример, из-за которого возникла потребность. Нужно выдавать данные, у которых статус archived !== true. Такой запрос это решает:

  ```js
  [
  	{
  		bool: {
  			must_not: {
  				term: { 'states.archived': true }
  			}
  		}
  	}
  ];
  ```

## 2023-08-05 v0.4.0

### Общие изменения

- Версионность. Теперь про ноды. Наработался опыт изменения версий нод, стало понятно, что не удобно из-за каждого изменения создавать новую ноду в Noodl. Слишком муторно их менять. С другой стороны, нужно как то обезапаситься от ошибок. Берем на вооружение такой принципЖ
  - На уровне Noodl все ноды будут иметь только первую цифру версии, т.е. v0, v1 и т.д.
  - На уровне Rolder Kit, т.е. при его рахработке остаются полные версии из 3-х цифр. Нужно чтобы сохранялась история, чтобы откатиться, если что.
  - Таким образом, версия в Noodlбудет меняться только если есть изменения, которые нельзя совместить с предыдущей версией, которые ломают существующие ноды. Например, если переименован существующий порт, сама нода или изменился формат данных. Переходить будем постепенно. Первая нода: Select v0.

### Изменения нод

#### Select v0(.4.0)

- Теперь Select выдает на выход выбранный item. Output называется Selected item.

#### App 0.3.0

- Исправлен баг, из-за которого новая авторизация выкидвала пользователя раньше положенного.

#### AppShell 0.1.0

- В схеме параметр color теперь распознается не только для SideBar, но и для Header.

## 2023-08-05 v0.3.0

### Общие изменения

- Версионность. Разобрался с версионностью. Теперь она приведена к общему подходу. К слову, это так же и для всех проектов, не только Rolder Kit. Принцип верисонирования:
  - Первая цифра: глобальные изменения. Например, переводя Раско на Noodl появится версия 2 как только выдадим клиенту первый набор функций. При этом, начинаем мы с цифры 0, как сейчас со Стартумом, а цифра 1 появится с полным выполнением ТЗ заказчика.
  - Вторая цифра: новые функции, доработки функций.
  - Третья цифра: исправление багов.
  - Соответсвенно, если исправили баги и добавили функйии, растет вторая цифра, если только баги, только последняя.
- В настроки Noodl добавлена версия проекта: Project version. Сейчас просто для удобства, когда Noodl прикрутит Github, будем использовать там. Удобство в том, что при debug=2, версия видна в консоли в объекте Rolder, что помогает не запутаться между вуерсиями dev, stage, prod.
- Уложился принцип использования сторонних библиотек. Все библиотеки называются с большой буквы, чтобы не путать с функциями. Внутри Rolder Kit они импортируются стнадартным способом. В Noodl часть из них подаются в объект window, что позволяет их вызывать напрямую. Сейчас это три библиотеки: Dayjs для работы с датами, Clone для глубоко клонирования объектов и Mustache для работы с шаблонами. Таким образом вызывать их нужно напрямую: Clone(), Dayjs() и т.д.

### Изменения нод

#### App

- Доработана авторизация. Раньше авторизация обновлялась только с обновлением всей старнницы, сейчас обновляется каждый раз при активации вкладки или всего браузера. Принцип работы:
  - При авторизации Kuzzle возвращает JWT, который записываетсяв куки.
  - При некторых событиях JWT проверяется на актуальность и обновляется. Сравнивается время его жизни (в найстройках Noodl Session timout). Время еще есть, JWT из куки проверяется Kuzzle на валидность. Если JWT валидный и время не вышло, ползователь попадает в приложение, иначе в окно авторизации.
  - Есть три события, когда обрабатывается JWT: при авторизации он первый раз попадает в куки, при нициализации бекенда и активации окна он валидируется и обновляется.
  - Таким образом, если установить Session timout, скажем на 8 часов, то пользователь будет видеть окно авторизации каждое утро, т.к. за ночь JWT ни разу не обновится. Если же поставить на 24 часа, то пользователь будет проходить авторизацию после выходных.

## 2023-08-04 v0.2.0

### Общие изменения

- Rolder Kit теперь написан на Typescript.
- Все инпуты сгруппированы по типам.

### Новые ноды

- Новая молекула UnstyledButton. Используется когда какой-то компонент нужно превратить в кнопку. Пример: плитка уборки в Стартуме, в мобильной версии.
- Новая нода для обновления несколько объектов разом: mUpdate.

### Изменения нод

#### App

- Изменен приницп работы со связями. Теперь свзяи нужно укзывать прямо в схеме классов. Пример:

  ```js
  [
      complex: {
          version: 1,
          subscribe: true,
          defaultSort: { 'content.name': 'asc' },
          defaultOptions: { size: 100 }
      },
      house: {
          version: 1,
          subscribe: true,
          references: ['complex'],
          defaultSort: { 'content.name': 'asc' },
          defaultOptions: { size: 100 }
      },
  ]
  ```

- Принцип работы. Каждый раз когда исползуется UseData, запускаются два сценария:
  - Запрашиваемый класс переберает все классы, проверяя есть ли они в references. Если есть, ищет совпадающие объекты каждого класса из references и вставляет их.
  - Запрашиваемый класс смотрит свои references, ищет совпадающие объекты для каждого и добавляет их.
- Таким образом, не важно какой класс загрузится первым, один из сценариев вставит объекты по связям. Например, если в примере выше complex загрузится первым, то связи проставятся, когда загрузится house, т.к. прописано references: ['complex'], т.е. первый сценарий. Если же house загрзуится первым, то связи проставятся, когда загрузится complex, т.к. он переберет все классы и найдет себя в references в классе house.

#### UseData

- Добавлен статус loading. Он есть у самой UseData и у объекта Noodl, в который UseData записывает данные.
- Поправлен баг, из-за которого не обновлялись данные при subcribe: true
- Убрана опция Set references

#### UseSearch v0.2.0

- За счет нового подхода к связям теперь проделывает такую работу с найденными данными:
  - Заменяет найденные объекты объектами Noodl, тем самым восстанавливая связи.
  - В соответсвии с параметром Database classes, добавляет в реузльтааты поиска свзязанные данные.

#### Шаблоны Mustache

- Добавлена возможность экранировать спец. символы. Если в выводимых данных есть кавычки или другие символы, нужно использовать тройные скобки: '{{{content.name}}}'. Это работает для таблицы и всех компонентов-инпутов, у которых есть поле "Label field".

#### Select v0.3.0

- Устаканился принцип работы. Этот же принцип постепенно будет использоовать в дргих компонентах такого типа. Теперь он может обрабатывать 2 типа данных: Items и Custom items. Items основной, здесь нужно использовать стандартный формат данных любого класса. Нужно просто подать массив данных, Select сам конвертирует в нужный формат. Второй тип данных ручной: Custom items. Его нужно использовать, когда данные для выбора требуется создать на месте, а не брать с базы. Формат должен быть такой:

  ```js
  [
  	{
  		value: 'option1',
  		label: 'Вариант 1'
  	},
  	{
  		value: 'option2',
  		label: 'Вариант 2'
  	}
  ];
  ```

## 2023-07-28 v0.1.2

### Общие изменения

- Миша обнаружил проблему, некоторые ноды выдают ошибку, если какой то обязательный параметр пуст. Все ноды теперь обернуты в специальный wrapper, который берет параметр portsToCheck и проверяет заполнены ли эти параметры, если не заполненны прямо на старннице где раполоагется нода будет выдано предупреждение. Если вы увидели какую то ноду, которая выдает ошибку на какой то пустой параметр, сообщайте, буду добавлять проверку или дефолтное значение.
- Принял решение изменить название переменной класса БД. Была 'className', стала 'dbClass'. Слишком много пересченией с другими класами: клсаа js, класс css...

### Новые молекулы

- Box. Box - единственная молекула, которая не имеет праметров в Mantine. Она принимает только sx. Для этого и создана - прикручивать любой css. Очень похожа на Group в Noodl. В нашем случае добавлены параметры высоты, ширины и автовысоты. Эта нода появилась из-за потребности упралять скролом, когда скрол всей странницы не подходит. Чтобы скрол заработал, нужно, чтобы дочерние ноды поддерживали скрол или нужно обернуть дочерние ноды Box в ScrollArea. Сейчас проверено на Table v0.2.0 Как использовать: нужно включить параметра Autoheigth и указать Bottom offset. Работает так: Box берет высоту экрана (portview), отнимает Bottom offset и задает фиксированную высоту, что и является требованием для включения скрола.
- Table v0.2.0:

  - Добавлена опция 'respectLineBreak' в схему таблицы. Эта опция нужна, если требуется сохранить переносы строк исходного текста. Пример использования:

    ```js
    [
    	{
    		accessor: 'content.name',
    		title: 'Название',
    		width: '8rem'
    	},
    	{
    		accessor: 'content.description',
    		title: 'Описание',
    		width: '8rem',
    		props: {
    			respectLineBreak: true
    		}
    	}
    ];
    ```

  - Добавлена возможность использовать шаблоны доступа к данным поля. Для этого используется библиоткека Mustache. Пример использования:

    ```js
    [
    	{
    		accessor: 'Уважаемый {{content.firstName}} {{content.lastName}}, еще текст...',
    		title: 'ФИО',
    		width: '8rem'
    	}
    ];
    ```

  - Добавлена проверка, что схема таблицы не пуста.
  - Теперь таблица не ждет структуры данных, для которой нужно указывать класс БД. В нее нужно подавать массив объектов.

- UseData v0.2.0 Добавлена проверка, что класс БД указан.

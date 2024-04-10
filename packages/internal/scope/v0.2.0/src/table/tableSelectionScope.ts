import { atom as jotaiAtom } from "jotai" // , Provider as JotaiProvider, useAtom
import type { Item } from "../../../../../../types/types"


// Задаем тип данных для scope
// Это для разработки, чтобы не делать ошибки
export interface TableSelectionScopeValues { [itemId: string]: 'selected' | 'indeterminated' | 'notSelected' | undefined }

export interface TableselectionByDBClass { [tableId: string]: Item[] | undefined }

export interface TableSelectionScopeInternal { 
    parentTableIdByTableId: { [tableId: string]: string | undefined },
    tableParentItemByTableId: { [tableId: string]: string | undefined },
    parentTableSelectionStateByTableId: { [itemId: string]: 'selected' | 'indeterminated' | 'notSelected' | undefined }, 
    tableIndeterminatedItemsIdList: string [],
    allTableIdList: string [],
    forRenderTableId: {
        parentTableId: (string | undefined),
        currentTableId: (string | undefined),
        newTableId: (string | undefined)[],
        childTableId: (string | undefined)[],
    },
}

// Присваиваем id самой ноде TableSelectionScope
// const tableSelectionScopeId = useId()
// Словарь состояний selection для каждого item
const tableSelectionScopeAtom = jotaiAtom<TableSelectionScopeValues>({})

// Присваиваем id самой ноде TableSelectionScope
// const tableSelectionScopeId = useId()
const tableselectionByDBClassAtom = jotaiAtom<TableselectionByDBClass>({})

// Присваиваем id самой ноде TableSelectionScope
// const tableSelectionScopeId = useId()
const tableSelectionScopeInternalAtom = jotaiAtom<TableSelectionScopeInternal>({
    'parentTableIdByTableId': {},                   // Словарь id родительской таблицы для кажждой таблицы
    'tableParentItemByTableId': {},                 // Словарь родительских item для кажждой таблицы
    'parentTableSelectionStateByTableId': {},       // Словарь со статусами всей таблицы, для принятия статуса отца на основании всех детей
    'tableIndeterminatedItemsIdList': [],           // Массив с id запсией, которые должны быть indeterminated
    'allTableIdList': [],                           // Массив всех tableId для отладки, так как в объекте они встают по алфовиту
    'forRenderTableId': {                           // Массив с id таблиц, которые должны пересмотреть свои селекты, но не от родителей
        parentTableId: undefined,
        currentTableId: undefined,
        newTableId: [],
        childTableId: [],
    },
})

// Атом, хранящий функции перерендера таблиц
const tableHandlerAtom = jotaiAtom<{ [tableId: string]: any}>({})

// Экспортируем атомы - радиация!!!
export { tableSelectionScopeAtom, tableselectionByDBClassAtom, tableSelectionScopeInternalAtom, tableHandlerAtom }


// // ВЕСЬ ЭТОТ ПАКЕТ - ЭТО ИНСТРУМЕНТ СОЗДАНИЯ SCOPE, ОН САМ НИЧЕГО НЕ ДЕЛАЕТ!!!!
// // ЭТО БЛЯТЬ - БИБЛИОТЭКА!!!



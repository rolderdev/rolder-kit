import { atom as jotaiAtom } from "jotai" // , Provider as JotaiProvider, useAtom
import type { Item } from "../../../../../../types/types"


// Задаем тип данных для scope
// Это для разработки, чтобы не делать ошибки
export interface TableSelectionScopeValues { [itemId: string]: 'selected' | 'indeterminated' | 'notSelected' | undefined }

export interface TableSelectionChildIdsByParentId { [itemId: string]: string[] | undefined }

export interface TableSelectionByDBClass { [tableId: string]: Item[] | undefined }

export interface TableSelectionScopeInternal { 
    tableIdByItemId: { [itemId: string]: string },
    tableIndeterminatedItemsIdList: string [],
    allTableIdList: string [],    
}

// Присваиваем id самой ноде TableSelectionScope
// const tableSelectionScopeId = useId()
// Словарь состояний selection для каждого item
const tableSelectionScopeAtom = jotaiAtom<TableSelectionScopeValues>({})

const tableSelectionChildIdsByParentIdAtom = jotaiAtom<TableSelectionChildIdsByParentId>({
    'root': [] // Массив с id items 1 уровня
})

const tableSelectionClickItemIdAtom = jotaiAtom<string>('')

// Присваиваем id самой ноде TableSelectionScope
// const tableSelectionScopeId = useId()
const tableselectionByDBClassAtom = jotaiAtom<TableSelectionByDBClass>({})

// Присваиваем id самой ноде TableSelectionScope
// const tableSelectionScopeId = useId()
const tableSelectionScopeInternalAtom = jotaiAtom<TableSelectionScopeInternal>({
    'tableIdByItemId': {},                          // Словарь, где ключи - id записей, а значения - id таблиц
    'tableIndeterminatedItemsIdList': [],           // Массив с id запсией, которые должны быть indeterminated
    'allTableIdList': [],                           // Массив всех tableId для отладки, так как в объекте они встают по алфовиту
})

// Атом, хранящий функции перерендера таблиц
const tableHandlerAtom = jotaiAtom<{ [tableId: string]: any}>({})

// Экспортируем атомы - радиация!!!
export { 
    tableSelectionScopeAtom, 
    tableSelectionChildIdsByParentIdAtom,
    tableSelectionClickItemIdAtom,
    tableselectionByDBClassAtom, 
    tableSelectionScopeInternalAtom, 
    tableHandlerAtom 
}


// // ВЕСЬ ЭТОТ ПАКЕТ - ЭТО ИНСТРУМЕНТ СОЗДАНИЯ SCOPE, ОН САМ НИЧЕГО НЕ ДЕЛАЕТ!!!!
// // ЭТО БЛЯТЬ - БИБЛИОТЭКА!!!



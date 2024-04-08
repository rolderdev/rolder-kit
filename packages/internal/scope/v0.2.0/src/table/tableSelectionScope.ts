import { atom as jotaiAtom, Provider as JotaiProvider, useAtom } from "jotai"

// Задаем тип данных для scope
// Это для разработки, чтобы не делать ошибки
export interface TableSelectionScopeValues { 
    tableSelectionScope: { [itemId: string]: 'selected' | 'indeterminated' | 'notSelected' },
    parentTableIdByTableId: { [tableId: string]: string | undefined },
    tableParentItemByTableId: { [tableId: string]: string | undefined },
    tableIndeterminatedItemsIdList: string [],
    allTableIdList: string [],
    forRenderTableId: {
        parentTableId: (string | undefined),
        currentTableId: (string | undefined),
        newTableId: (string | undefined),
        childTableId: (string | undefined)[],
    },
    selectionByTableId: { [tableId: string]: any },
}

// Присваиваем id самой ноде TableSelectionScope
// const tableSelectionScopeId = useId()
const tableSelectionScopeAtom = jotaiAtom<TableSelectionScopeValues>({
    'tableSelectionScope': {},                      // Словарь состояний selection для каждого item
    'parentTableIdByTableId': {},                   // Словарь id родительской таблицы для кажждой таблицы
    'tableParentItemByTableId': {},                 // Словарь родительских item для кажждой таблицы
    'tableIndeterminatedItemsIdList': [],           // Массив с id запсией, которые должны быть indeterminated
    'allTableIdList': [],                           // Массив всех tableId для отладки, так как в объекте они встают по алфовиту
    'forRenderTableId': {                           // Массив с id таблиц, которые должны пересмотреть свои селекты, но не от родителей
        parentTableId: undefined,
        currentTableId: undefined,
        newTableId: undefined,
        childTableId: [],
    },
    selectionByTableId: {}
})

// Атом, хранящий функции перерендера таблиц
const tableHandlerAtom = jotaiAtom<{ [tableId: string]: any}>({})

// Экспортируем атомы - радиация!!!
export { tableSelectionScopeAtom, tableHandlerAtom }




// // Задаем scope, при помощи bunshi
// import { createScope, molecule } from "bunshi";
// import { useMolecule } from "bunshi/react";
// // Сами данные хранит atom из nanostores
// import { atom as jotaiAtom, Provider as JotaiProvider, useAtom } from "jotai"

// // Задаем тип данных для scope
// // Это для разработки, чтобы не делать ошибки
// // export interface TableSelectionScopeValues { [tableId: string]: Item[] }
// export interface TableSelectionScopeValues { 
//     tableSelectionScope: { [itemId: string]: 'selected' | 'indeterminated' | 'notSelected' },
//     parentTableIdByTableId: { [tableId: string]: string},
//     tableParentItemByTableId: { [tableId: string]: string},
//     tableClickItemsId: (string | undefined)[],
//     tableIndeterminatedItemsIdList: string [],
//     allTableIdList: string [],
//     forRenderTableId: {
//         [id: string]: (string | undefined),
//     },
// }

// // Создае scope, пока не привязанный ни к чему
// export const TableSelectionScope = createScope<unknown>(undefined);

// // Создаем молекулу, которая живет только в этом scope и хранит состояния выбранности записей
// export const TableSelectionScopeMolecule = molecule((_, scope) => {       
//     // Говорим, что эта молекула работает в этом скоупе
//     scope(TableSelectionScope)
//     return jotaiAtom<TableSelectionScopeValues>({
//         'tableSelectionScope': {},                      // Словарь состояний selection для каждого item
//         'parentTableIdByTableId': {},                   // Словарь id родительской таблицы для кажждой таблицы
//         'tableParentItemByTableId': {},                 // Словарь родительских item для кажждой таблицы
//         'tableClickItemsId': [],                        // Массив, хранящий id нажатого item и родительского item
//         'tableIndeterminatedItemsIdList': [],           // Массив с id запсией, которые должны быть indeterminated
//         'allTableIdList': [],                           // Массив всех tableId для отладки, так как в объекте они встают по алфовиту
//         'forRenderTableId': {                           // Массив с id таблиц, которые должны пересмотреть свои селекты, но не от родителей
//             parentTableId: '',
//             currentTableId: '',
//             childTableId: '',
//         }
//     })
// })


// // Проводник для других скриптов, где описана логика раборты со scope
// export function useTableSelectionScope() {

//     const tableSelectionScopeMol = useMolecule(TableSelectionScopeMolecule)
    
//     const [ tableSelectionScopeValue, setTableSelectionScopeValue ] = useAtom(tableSelectionScopeMol)

//     return { tableSelectionScopeValue, setTableSelectionScopeValue }
// }

// // ВЕСЬ ЭТОТ ПАКЕТ - ЭТО ИНСТРУМЕНТ СОЗДАНИЯ SCOPE, ОН САМ НИЧЕГО НЕ ДЕЛАЕТ!!!!
// // ЭТО БЛЯТЬ - БИБЛИОТЭКА!!!



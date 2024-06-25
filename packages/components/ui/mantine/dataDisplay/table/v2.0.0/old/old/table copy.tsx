/* Компонента подготваливает колонки и настройки таблицы.
Это внешний контур таблицы. Поведение расчитано на изменения приходящие от разработчика через порты.

Устанавливает все пропсы прямо, даже если это ничего не меняет. Группирует пропсы для удобства.

Устанавливает дефолты. Можно было бы делать обычным способом - через настройку портов ноды,
но слишком много сообщений об обязательнвх портах достают разработчика. Поэтому везде явные дефолты.

Нужно помнить на уровне портов установленный дефолт всегда есть для явно задаваемых портов (строки, числа).
Если разработчик передает такой порт пустым, значение все равно будет установлено дефолтным.
Поэтому, здесь такие дефолты повторяются, чтобы не путаться.

Дефотлные значения нужны еще и для решения пробkемы наследовагия стилей. Без них, таблица наседует стили родительской таблицы.

Порядок параметров отнсоительно синхронизирован с types.d.ts

libProps - стнадартные настройки библиотеки, которые не используются или используются повторно в Table.

Fetching, items и columnsDefinition обрабатываются как зависимый стейт, чтобы оптимизировать рендеринг - выдавать все разом по готовности.
*/

import { forwardRef, useImperativeHandle, useMemo, useState } from "react"
import { useSetState, useShallowEffect } from "@mantine/hooks";
import { getCompProps } from '@packages/get-comp-props'
import { sendOutput } from "@packages/port-send";
import type { Props, TableState } from "./types"
import getColumn from "./src/funcs/getColumn";
import { expendRows, updateExpansionRows } from "./src/funcs/expansionRows";
import getInitialState from "./src/funcs/getInitialState";
import useExpensionRowsIds from "./src/hooks/useExpensionRowsIds";
import { setSelectedRecord } from "./src/funcs/singleSelection";
import TableInstance from "./src/TableInstance"

// Стили загружаем здесь, просто кажется логичным делать это до загрузки TableInstance
import '@mantine/core/styles/Table.css';
import 'mantine-datatable/styles.css';

export default forwardRef(function (props: Props, ref) {
    // Даем разработчику извращаться, если он смелый
    const p: Props = { ...getCompProps(props) };

    // Состояние рендеринга. Этот хак нужен, чтобы хуки не порождали рендеринги, когда мы точно знаем, что рано.
    const [firstRender, setFirstRender] = useState(true)

    // Используем один стейт для всей таблицы, чтобы обновлять его одновременно, оптимизируя рендеринг
    // Заодно задавая все нужные дефолты
    // Используем мантиновский useSetState. т.к. он позволяет устанавливать состояние частично. Важно не мутировать tableState
    const [tableState, setTableState] = useSetState<TableState>(getInitialState(p)) // Первичное состояние для 1-го рендеринг

    // Здесь мы определяем, на что приходящее с портов будем реагировать, устанавлиявая состояние таблицы.
    // Для первой загрузки это 2-й рендеринг, далее при смене одной из зависимостей - items или columnsDefinition.
    // Shallow, т.к. схема колонок и items - массив объектов, который не умеет сравнивать useEffect.
    useShallowEffect(() => {
        // Функция асинхронная. useShallowEffect не умеет асинхронно, поэтому через then
        // Создаем все варианты колонок разом. Используем p.items, т.к. records еще нет
        // Нужна небольшая задержка перед getColumn, чтобы успела отрисоваться анимация загрузки, если много тяжелых ячеек
        // Эта задержка особенно важна, когда таблица - это разворачиваемая строка.
        setTimeout(() => {
            if (p.items && p.columnsDefinition) {
                Promise.all(p.columnsDefinition.map(async (columnDefinition) => getColumn(tableState, columnDefinition, p.items || [])))
                    .then(async (columns) => {
                        const items = p.items || []
                        // Создаем ноды для разворачивания
                        if (props.expansion) {
                            // Создадим разворачиваемы строки. Нужно подавать и развернутые строки с порта, чтобы первичное состояние
                            // было синхронно между tableState.expendedRowsIds и p.expandedItems и хука ниже не создавала лишний рендер
                            // В tableState еще нет records, передаем p.items
                            await updateExpansionRows(tableState, items, p.expandedItems?.map(i => i.id) || [])
                        }
                        // Запишем состояние после создания нод
                        setTableState((s) => {
                            s.fetching = false
                            s.columns = columns
                            s.records = items
                            // Единичный выбор
                            // Если задана функция, разработчик сам управляет, иначе включаем поведение для единичного выбора
                            s.onRowClick = ({ record }) => p.onRowClickFunc
                                ? p.onRowClickFunc(record, items)
                                : s.selection.single.enabled
                                    ? setSelectedRecord(p.noodlNode, s.selection.single, setTableState, record)
                                    : undefined
                            return s
                        })
                        // Если это первый рендер, снимем флаг, позволяя хукам обрабатывать состояние таблицы
                        // Так же отправим на выход состояния для первичного соответсвия вход-выход.
                        // Так разработчик будет ждать предсказуемого поведение - подал на вход, получил то же на выход.
                        // Но не подаем сигналы изменений состояния, ведь это первый рендер, ничего еще не менялось
                        if (firstRender) {
                            setFirstRender(false)
                            // Разворачивание. Используем местные items и expendedRowsIds из первичного состояния
                            sendOutput(tableState.noodlNode, 'expandedItems', items.filter(i => tableState.expendedRowsIds.includes(i.id)))
                        }
                    })
            }
        }, p.customProps?.collapseProps || 150) // 150 - дефолт transitionDuration при разворачивании
        // Порты, на которые мы реагируем
    }, [p.items, p.columnsDefinition]);

    // Развертывание 
    // Хука обновляет tableState, поэтому ей не нужно ничего выдавать. Работает со второго рендера.    
    useExpensionRowsIds(tableState, p.expansion, firstRender, p.expandedItems, setTableState)

    // Единичный выбор
    //const [selectedRecord, setSelectedRecord] = useState()

    // Обрабатываем сигналы с входящих портов
    useImperativeHandle(ref, () => ({
        //resetSelecedItem() { resetSelectedRecord() },
        //resetSelecedItems() { setSelectedRecords([]) },
        /* table2ResetSort() { setSortStatus(undefined) },
        table2ResetFilters() { resetFilters(); forceUpdate() }, */
        expandAll() { if (p.items) expendRows(tableState.tableId, p.items.map(i => i.id)) },
        unexpandAll() { expendRows(tableState.tableId, []) }
    }), [tableState.tableId, p.items])

    //console.log('Table render', tableState.tableId, tableState.selection.single.selectedItem?.id);

    const memoTableState = useMemo(() => tableState, [tableState]);
    return <TableInstance {...memoTableState} />
})

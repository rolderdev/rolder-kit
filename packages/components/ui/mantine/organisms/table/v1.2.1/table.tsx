import { cloneElement, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Box } from '@mantine/core';
import type { Props } from './types';
import { DataTable } from './src/lib';
import { getCompProps } from "@packages/get-comp-props"
import useProps from './src/hooks/useProps';
import type { Item } from 'types';
import React from 'react';
import useSingleSelection from './src/hooks/useSingleSelection';
import useMultiSelection from './src/hooks/useMultiSelection';
import useRowStyles from './src/hooks/useRowStyles';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { sendOutput, sendSignal } from '@packages/port-send';
import { Expander } from './src/components/expander';
import useSort from './src/hooks/useSort';
import getRecords from './src/funcs/getRecords';
import { ScopeProvider } from "bunshi/react";
import { useForceUpdate, useId } from '@mantine/hooks';

import { useAtom } from "jotai"
import { tableHandlerAtom, tableSelectionScopeAtom } from "@packages/scope"

// Импортируем созданные нами scope из @packages/scope
import {
    TableFilterScope,
    useTableCellScope,
    useTableFilterScope,
} from "@packages/scope";

export default forwardRef(function (props: Props, ref) {
    const { noodlNode, customProps, children } = props
    const p = { ...getCompProps(props) } as Props

    const {
        libProps, columnsDef, items, onRowClick,
        dimensions, tableStyles, rowStyles,
        sort, filter, selection, expansion, fetching
    } = useProps(p)

    const forceUpdate = useForceUpdate()

    // ColumnCell repeater render hack
    useEffect(() => {
        setTimeout(() => forceUpdate())
    }, [items])

    const tableId = useId()

    // Single selection
    const { selectedRecord, setSelectedRecord } = useSingleSelection(noodlNode, tableId, selection.single, items)
    // Multi selection
    const { selectedRecords, setSelectedRecords } = useMultiSelection(noodlNode, tableId, selection.multi, items)

    //========scopeMultiSelection============================================================
    // Если включен expension и multiselection, то берем состояния select из tableSelectionScope

    // console.log("===========================================================================")
    // console.log("TABLEID", tableId)

    //====Хуки, которые понядобятся при работе с tableSelectionScope====
    // Молекула с родительским item
    const tableCellMol = useTableCellScope()
    // Атом с tableSelectionScope
    const [tableSelectionScopeValue, setTableSelectionScopeValue] = useAtom(tableSelectionScopeAtom)

    // id родительской таблицы
    const parentTableId = tableCellMol?.parentTableId ? tableCellMol.parentTableId : undefined
    // id родительской записи
    const parentTableItemId = tableCellMol?.id

    // Если в молекуле ещё нет связки id текущей таблицы и id родительской таблицы
    // то создаем эту связь
    useEffect(() => {
        if (tableId !== '' && tableId !== undefined) {
            if (!tableSelectionScopeValue['parentTableIdByTableId'][tableId]) {
                // Создаем запись в молекулу о том, у какой таблицы какой item является родительским
                if (tableId && (typeof parentTableId === 'string')) {
                    tableSelectionScopeValue['parentTableIdByTableId'][tableId] = parentTableId
                }
                // Создаем запись в молекулу о том, у какой таблицы какой item является родительским
                if (tableId && parentTableItemId) {
                    tableSelectionScopeValue['tableParentItemByTableId'][tableId] = parentTableItemId
                }
            }

            if (!tableSelectionScopeValue['allTableIdList'].includes(tableId)) {
                tableSelectionScopeValue['allTableIdList'].push(tableId)
            }


            // После раскрытия таблицы, items появляются не сразу, поэтому при их изменении, добавляем их в scope
            if (items.length > 0) {
                // Наследуем статус от родителей
                //console.log("ITEMS в useEffect!!!", items)
                items.forEach(item => {
                    if (item && parentTableItemId && tableSelectionScopeValue['tableSelectionScope'][item.id] === undefined) {
                        // Если статус родителя не indeterminated
                        if (tableSelectionScopeValue['tableSelectionScope'][parentTableItemId] !== 'indeterminated') {
                            tableSelectionScopeValue['tableSelectionScope'][item.id] = tableSelectionScopeValue['tableSelectionScope'][parentTableItemId]
                        }
                        // А если родительский item indeterminated, и нет записи в scope  
                        // а она может быть при повторном разворачивании
                        // то -notSelected
                        else {
                            if (tableSelectionScopeValue['tableSelectionScope'][item.id] === undefined) {
                                tableSelectionScopeValue['tableSelectionScope'][item.id] = 'notSelected'
                            }
                        }
                    }
                    // Если нет родителя
                    else if (!parentTableItemId) {
                        // И нет записи в scope
                        if (tableSelectionScopeValue['tableSelectionScope'][item.id] === undefined) {
                            tableSelectionScopeValue['tableSelectionScope'][item.id] = 'notSelected'
                        }
                    }

                    //console.log("??????? Присвоен статус", item.id, ':::::', tableSelectionScopeValue['tableSelectionScope'][item.id])
                })
            }

            // И говорим, что нужно перерендерить эту таблицу, 
            // чтобы записанные в scope статусы обновились у таблицы
            // tableSelectionScopeValue['forRenderTableId']['currentTableId'] = tableId
            tableSelectionScopeValue['forRenderTableId'] = {
                parentTableId: undefined, //tableSelectionScopeValue['parentTableIdByTableId'][tableId],
                currentTableId: undefined,
                newTableId: tableId, // Так как таблицу только открыли, нужно перерендерить
                childTableId: Object.keys(tableSelectionScopeValue['parentTableIdByTableId']).filter(key => tableSelectionScopeValue['parentTableIdByTableId'][key] === tableId),
            }
            setTableSelectionScopeValue(tableSelectionScopeValue)

        }
        sendOutput(props.noodlNode, 'tableId', tableId)

        return () => {
            //console.log('<<<<<<<<<<<<<<Закрыли таблицу', tableId)
            // Удаляем запись из молекулы о том, у какой таблицы какой item является родительским
            delete tableSelectionScopeValue['parentTableIdByTableId'][tableId]
            // Удаляем запись из молекулы о том, у какой таблицы какой item является родительским
            delete tableSelectionScopeValue['tableParentItemByTableId'][tableId]
            // Удаляем запись из молекулы о том, нужно ли рендерить таблицу
            // delete tableSelectionScopeValue['renderByFlag'][tableId]
            tableSelectionScopeValue['allTableIdList'] = tableSelectionScopeValue['allTableIdList'].filter(iTableId => iTableId !== tableId)

            setTableSelectionScopeValue(tableSelectionScopeValue)
        }

    }, [tableId, items])



    // useEffect(() => {
    //     if (tableId !== '' && tableId !== undefined) {
    //         if (!tableSelectionScopeValue['parentTableIdByTableId'][tableId]) {
    //             // Создаем запись в молекулу о том, у какой таблицы какой item является родительским
    //             if (tableId && (typeof parentTableId === 'string')) {
    //                 tableSelectionScopeValue['parentTableIdByTableId'][tableId] = parentTableId
    //             }
    //             // Создаем запись в молекулу о том, у какой таблицы какой item является родительским
    //             if (tableId && parentTableItemId) {
    //                 tableSelectionScopeValue['tableParentItemByTableId'][tableId] = parentTableItemId
    //             }
    //         }

    //         if (!tableSelectionScopeValue['allTableIdList'].includes(tableId)) {
    //             tableSelectionScopeValue['allTableIdList'].push(tableId)
    //         }
    //         // И говорим, что нужно перерендерить эту таблицу, 
    //         // чтобы записанные в scope статусы обновились у таблицы
    //         // tableSelectionScopeValue['forRenderTableId']['currentTableId'] = tableId
    //         setTableSelectionScopeValue(tableSelectionScopeValue)

    //     }
    //     sendOutput(props.noodlNode, 'tableId', tableId)

    //     return () => {
    //         console.log('<<<<<<<<<<<<<<Закрыли таблицу', tableId)
    //         // Удаляем запись из молекулы о том, у какой таблицы какой item является родительским
    //         delete tableSelectionScopeValue['parentTableIdByTableId'][tableId]
    //         // Удаляем запись из молекулы о том, у какой таблицы какой item является родительским
    //         delete tableSelectionScopeValue['tableParentItemByTableId'][tableId]
    //         // Удаляем запись из молекулы о том, нужно ли рендерить таблицу
    //         // delete tableSelectionScopeValue['renderByFlag'][tableId]
    //         tableSelectionScopeValue['allTableIdList'] = tableSelectionScopeValue['allTableIdList'].filter(iTableId => iTableId !== tableId)

    //         setTableSelectionScopeValue(tableSelectionScopeValue)
    //     }

    // }, [tableId])

    // console.log("ITEMS!!!", items)

    // // После раскрытия таблицы, items появляются не сразу, поэтому при их изменении, добавляем их в scope
    // useEffect(() => {
    //     // так как таблицу открываем заново, то id какое-то время не будет, и чтобы не было косяков
    //     if (tableId) {
    //         // Наследуем статус от родителей
    //         console.log("ITEMS в useEffect!!!", items)
    //         items.forEach(item => {
    //             if (item && parentTableItemId && tableSelectionScopeValue['tableSelectionScope'][item.id] === undefined) {
    //                 // Если статус родителя не indeterminated
    //                 if (tableSelectionScopeValue['tableSelectionScope'][parentTableItemId] !== 'indeterminated') {
    //                     tableSelectionScopeValue['tableSelectionScope'][item.id] = tableSelectionScopeValue['tableSelectionScope'][parentTableItemId]
    //                 }
    //                 // А если родительский item indeterminated, и нет записи в scope  
    //                 // а она может быть при повторном разворачивании
    //                 // то -notSelected
    //                 else {
    //                     if (tableSelectionScopeValue['tableSelectionScope'][item.id] === undefined) {
    //                         tableSelectionScopeValue['tableSelectionScope'][item.id] = 'notSelected'
    //                     }
    //                 }
    //             }
    //             // Если нет родителя
    //             else if (!parentTableItemId) {
    //                 // И нет записи в scope
    //                 if (tableSelectionScopeValue['tableSelectionScope'][item.id] === undefined) {
    //                     tableSelectionScopeValue['tableSelectionScope'][item.id] = 'notSelected'
    //                 }
    //             }

    //             console.log("??????? Присвоен статус", item.id, ':::::', tableSelectionScopeValue['tableSelectionScope'][item.id])
    //         })
    //         console.log("tableSelectionScopeValue В конце useEffect с items:", tableSelectionScopeValue)

    //         // И говорим, что нужно перерендерить эту таблицу, 
    //         // чтобы записанные в scope статусы обновились у таблицы
    //         tableSelectionScopeValue['forRenderTableId']['currentTableId'] = tableId

    //         // if (tableId) {
    //             tableSelectionScopeValue['forRenderTableId'] = {
    //               parentTableId: undefined, //tableSelectionScopeValue['parentTableIdByTableId'][tableId],
    //               currentTableId: tableId,
    //               childTableId: Object.keys(tableSelectionScopeValue['parentTableIdByTableId']).filter(key => tableSelectionScopeValue['parentTableIdByTableId'][key] === tableId),
    //             }
    //             setTableSelectionScopeValue(tableSelectionScopeValue)
    //           }
    //     // }
    // },[items])

    // Если записи уже попали в scope на этапе выше, при первом их получении с наследованием от родителя,
    // то можно запусать обработку массива выбранных
    const itemsInScope = items.length > 0
        ? tableSelectionScopeValue['tableSelectionScope'][items[0].id] !== undefined
            ? true
            : false
        : false

    // Если items нет, то снимаем флаг о том, что нужно перерендеривать селекты
    // Чтобы не сваливался в бесконечный цикл
    if (items.length === 0) {
        tableSelectionScopeValue['forRenderTableId'] = {
            parentTableId: tableSelectionScopeValue['forRenderTableId']['parentTableId'],
            currentTableId: tableId === tableSelectionScopeValue['forRenderTableId']['currentTableId']
                ? undefined
                : tableSelectionScopeValue['forRenderTableId']['currentTableId'],
            newTableId: tableId === tableSelectionScopeValue['forRenderTableId']['newTableId']
                ? undefined
                : tableSelectionScopeValue['forRenderTableId']['newTableId'],
            childTableId: tableSelectionScopeValue['forRenderTableId']['childTableId'].includes(tableId)
                ? tableSelectionScopeValue['forRenderTableId']['childTableId'].filter(childTableId => childTableId !== tableId)
                : tableSelectionScopeValue['forRenderTableId']['childTableId']
        }
        setTableSelectionScopeValue(tableSelectionScopeValue)
    }

    // Флаг о том, что состояния берем из scope
    const useScopeStates = expansion.enabled && selection.multi.enabled && itemsInScope

    //console.log("######################################## сТРЕГИРИЛА ТАБЛИЦА УРОВНЯ :", items?.[0]?.content?.level)

    const [tableHandlerAtomValue, setTableHandlerAtomValue] = useAtom(tableHandlerAtom)



    const refreshScopeValuesBySelect = () => {

        // console.log('+++++++++++++++++++++++++++++++++сработала refreshScopeValuesBySelect')
        // console.log('CUrrent ID', tableId)
        // console.log('ITEMS.LENGTH', items.length)

        // Флаг о том, были ли изменения
        let hasChange = false

        // Копируем имеющиеся выделенные записи, чтобы добавлять или удалять элементы
        let newSelectedRecords = [...selectedRecords]

        // Флаг о том, что parent indeterminated, так как хоть один item indeterminated
        let parentIsIndeterminated = false


        if (useScopeStates) {

            // Если это таблица, в которой было нажатие или её родитель, то не наследуем статусы
            const getByParent = tableSelectionScopeValue['forRenderTableId']['currentTableId'] === tableId || tableSelectionScopeValue['forRenderTableId']['parentTableId'] === tableId
                ? false
                : true

            // Перебираем элементы текущей таблицы
            items.forEach(item => {
                // Получаем статус записи из scope
                let tableSelectionScopeItem: "selected" | "notSelected" | "indeterminated"
                // Если есть родительский item и стоит флаг, что наследуем от родителя
                if (parentTableItemId && getByParent) {
                    // Если родитель выбран, то наследуем статус
                    if (tableSelectionScopeValue['tableSelectionScope'][parentTableItemId] === "selected") {
                        tableSelectionScopeItem = "selected"
                    }
                    // Если родитель не выбран, то наследуем статус
                    else if (tableSelectionScopeValue['tableSelectionScope'][parentTableItemId] === "notSelected") {
                        tableSelectionScopeItem = "notSelected"
                    }
                    // Иначе (сли родитель indeterminated), то получаем статус записи из scope
                    else {
                        tableSelectionScopeItem = tableSelectionScopeValue['tableSelectionScope'][item.id]
                    }
                }
                // Если родительского item нет, то получаем статус записи из scope
                else {
                    tableSelectionScopeItem = tableSelectionScopeValue['tableSelectionScope'][item.id]
                }
                // Если после проверок оказалось, что статус не найден, 
                // то проверяем по наличию в массиве выбранных
                if (!tableSelectionScopeItem) {
                    tableSelectionScopeItem = newSelectedRecords.length
                        ? newSelectedRecords?.find(record => record.id === item.id)
                            ? "selected"
                            : "notSelected"
                        : "notSelected"
                    tableSelectionScopeValue['tableSelectionScope'][item.id] = tableSelectionScopeItem
                    hasChange = true
                }

                // По полученному статусу добавляем или удаляем item в/из 
                // массива выбранных записей и массива indeterminated
                if (tableSelectionScopeItem === 'selected') {
                    // Если статус в scope не соответствует полученному
                    if (tableSelectionScopeValue['tableSelectionScope'][item.id] !== 'selected') {
                        tableSelectionScopeValue['tableSelectionScope'][item.id] = 'selected'
                        hasChange = true
                    }
                    // Если item ещё не в массиве выбранных, то добавляем
                    if (!newSelectedRecords.find(sItem => sItem.id === item.id)) {
                        newSelectedRecords.push(item)
                    }
                    // Если запись в массиве indeterminated, то удаляем из него
                    if (tableSelectionScopeValue['tableIndeterminatedItemsIdList'].includes(item.id)) {
                        tableSelectionScopeValue['tableIndeterminatedItemsIdList'] = tableSelectionScopeValue['tableIndeterminatedItemsIdList'].filter(itemId => itemId !== item.id)
                        hasChange = true
                    }
                }
                else if (tableSelectionScopeItem === "notSelected") {
                    // Если статус в scope не соответствует полученному
                    if (tableSelectionScopeValue['tableSelectionScope'][item.id] !== 'notSelected') {
                        tableSelectionScopeValue['tableSelectionScope'][item.id] = 'notSelected'
                        hasChange = true
                    }
                    // Если item в массиве выбранных, то удаляем
                    if (newSelectedRecords.find(sItem => sItem.id === item.id)) {
                        newSelectedRecords = newSelectedRecords.filter(record => record.id !== item.id)
                    }
                    // Если запись в массиве indeterminated, то удаляем из него
                    if (tableSelectionScopeValue['tableIndeterminatedItemsIdList'].includes(item.id)) {
                        tableSelectionScopeValue['tableIndeterminatedItemsIdList'] = tableSelectionScopeValue['tableIndeterminatedItemsIdList'].filter(itemId => itemId !== item.id)
                        hasChange = true
                    }
                }
                // А иначе статус будет indeterminated
                else {
                    // Если статус в scope не соответствует полученному
                    if (tableSelectionScopeValue['tableSelectionScope'][item.id] !== 'indeterminated') {
                        tableSelectionScopeValue['tableSelectionScope'][item.id] = 'indeterminated'
                        hasChange = true
                    }
                    // Если item в массиве выбранных, то удаляем
                    if (newSelectedRecords.find(sItem => sItem.id === item.id)) {
                        newSelectedRecords = newSelectedRecords.filter(record => record.id !== item.id)
                    }
                    // Если itemId ещё нет в массиве indeterminated, то добавляем
                    if (!tableSelectionScopeValue['tableIndeterminatedItemsIdList'].includes(item.id)) {
                        tableSelectionScopeValue['tableIndeterminatedItemsIdList'].push(item.id)
                        hasChange = true
                    }
                    // Так как у нас хоть один item indeterminated, то и отец indeterminated
                    if (parentTableItemId) {
                        tableSelectionScopeValue['tableSelectionScope'][parentTableItemId] = "indeterminated"
                        hasChange = true
                    }
                    parentIsIndeterminated = true
                }
            })

            // По итогу анализа состояний select всех элементов таблицы 
            // делаем вывод о состоянии родительского item
            // Если мы не наследуем, то перезаписываем отца
            if (parentTableItemId && !getByParent && !parentIsIndeterminated) {
                if (newSelectedRecords.length === items.length) {
                    // Проверяем, не равен ли он уже этому значению
                    if (!(tableSelectionScopeValue['tableSelectionScope'][parentTableItemId] === 'selected')) {
                        tableSelectionScopeValue['tableSelectionScope'][parentTableItemId] = 'selected'
                        hasChange = true
                    }
                }
                // Если выбраны не все, то indeterminated
                else if (newSelectedRecords.length !== 0 && newSelectedRecords.length !== items.length) {
                    // console.log(`Установили родительскому item ${parentTableItemId} статус indeterminated`)
                    if (!(tableSelectionScopeValue['tableSelectionScope'][parentTableItemId] === 'indeterminated')) {
                        tableSelectionScopeValue['tableSelectionScope'][parentTableItemId] = 'indeterminated'
                        hasChange = true
                    }
                }
                // А иначе notSelected
                // else if (newSelectedRecords.length === 0) {
                else {
                    // console.log(`Установили родительскому item ${parentTableItemId} статус notSelected`)
                    if (!(tableSelectionScopeValue['tableSelectionScope'][parentTableItemId] === 'notSelected')) {
                        tableSelectionScopeValue['tableSelectionScope'][parentTableItemId] = 'notSelected'
                        hasChange = true
                    }
                }
            }
            // Исправляем массив id на рендеринг
            // Если id текущей таблицы родительское, то записываем его родителя
            if (tableSelectionScopeValue['forRenderTableId']['parentTableId'] === tableId) {
                if (parentTableId) {
                    tableSelectionScopeValue['forRenderTableId']['parentTableId'] = parentTableId
                }
                else {
                    tableSelectionScopeValue['forRenderTableId']['parentTableId'] = undefined
                }

                hasChange = true
            }
            // Удаляем id текущей таблицы, так как она обработалась только что
            else if (tableSelectionScopeValue['forRenderTableId']['currentTableId'] === tableId) {
                tableSelectionScopeValue['forRenderTableId']['currentTableId'] = undefined
                hasChange = true
            }
            // Удаляем id текущей таблицы, если это новая, так как она обработалась только что
            else if (tableSelectionScopeValue['forRenderTableId']['newTableId'] === tableId) {
                tableSelectionScopeValue['forRenderTableId']['newTableId'] = undefined
                hasChange = true
            }
            // Если id текущей таблицы дочернее, то записываем дочерние
            else if (tableSelectionScopeValue['forRenderTableId']['childTableId'].includes(tableId)) {
                // Удали текущую таблицу из детей, так как она отрендерилась
                tableSelectionScopeValue['forRenderTableId']['childTableId'] = tableSelectionScopeValue['forRenderTableId']['childTableId']?.filter(iChildTableId => iChildTableId !== tableId)
                const childIds = Object.keys(tableSelectionScopeValue['parentTableIdByTableId']).filter(key => tableSelectionScopeValue['parentTableIdByTableId'][key] === tableId)
                tableSelectionScopeValue['forRenderTableId']['childTableId'] = [...tableSelectionScopeValue['forRenderTableId']['childTableId'], ...childIds]
                hasChange = true
            }

            setSelectedRecords(tableId, newSelectedRecords)

            // После того, как мы внесли все необходимые изменения в tableSelectionScopeValue, обновляем его        
            // Только если было изменение, обновляем атом
            if (hasChange) {
                // запись о том, в какой таблице какие items выбраны
                tableSelectionScopeValue['selectionByBDClass'][tableId] = newSelectedRecords
                setTableSelectionScopeValue(tableSelectionScopeValue)
            }

        }
        // console.log("tableSelectionScopeValue в конце:", { ...tableSelectionScopeValue })
        // console.log("Конец обработки статусов:", items[0]?.content?.level)
    }

    // Если текущая таблица должна обновить селекты, запускаем
    if (
        tableSelectionScopeValue['forRenderTableId']['parentTableId'] === tableId
        || tableSelectionScopeValue['forRenderTableId']['currentTableId'] === tableId
        || tableSelectionScopeValue['forRenderTableId']['newTableId'] === tableId
        || tableSelectionScopeValue['forRenderTableId']['childTableId'].includes(tableId)
    ) {
        refreshScopeValuesBySelect()
    }


    // Если отец есть в списке на перерендеринг, запускаем
    if (tableSelectionScopeValue['forRenderTableId']['parentTableId'] !== undefined) {
        tableHandlerAtomValue[tableSelectionScopeValue['forRenderTableId']['parentTableId']]()
    }
    // Если дети есть в очерерди на перерендеринг, запускаем
    // так как дети - это массив, и они могу быть в другой ветке
    if (tableSelectionScopeValue['forRenderTableId']['childTableId'].length > 0) {
        tableSelectionScopeValue['forRenderTableId']['childTableId'].forEach(iChildTable => {
            if (iChildTable) tableHandlerAtomValue[iChildTable]()
        })
    }

    // Создаем отдельную функцию, экземплары которой связаны с компонентоу 
    // и вызывая эту функцию по id таблицы, мы перерендерим именно её
    // и обновим статусы
    const forceUpdateThisTable = () => {
        forceUpdate()
    }
    // Сохраняем функцию ререндер в атом, под своим tableId
    if (tableHandlerAtomValue[tableId] === undefined) {
        setTableHandlerAtomValue((handlers) => ({ ...handlers, [tableId]: forceUpdateThisTable }))
    }

    //========scopeMultiSelection============================================================


    // Filter       
    const { filters, getColumnFilter, resetFilters, setFilterFunc, runFilterFunc } = useTableFilterScope(tableId)

    // Expansion
    const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([])

    useEffect(() => {
        sendOutput(noodlNode, 'table2ExpandedItems', items?.filter(i => expandedRecordIds.includes(i.id)))
        sendSignal(noodlNode, 'table2ExpansionChanged')
    }, [expandedRecordIds])
    const expansionRow = useMemo(() => {
        const ch: any = children
        return Array.isArray(ch)
            ? ch.filter(i => i.props.noodlNode.model?.type.split('.')[1] === 'ExpansionRow')?.[0]
            : ch?.props.noodlNode.model?.type.split('.')[1] === 'ExpansionRow'
                ? ch
                : null
    }, [])

    // Columns
    const columns = useMemo(() => {
        const ch: any = children
        // ColumnCell
        const columnCells = Array.isArray(ch)
            ? ch.filter(i => i.props.noodlNode.model?.type.split('.')[1] === 'ColumnCell')
            : ch?.props.noodlNode.model?.type.split('.')[1] === 'ColumnCell'
                ? [ch]
                : []

        // ColumnFilter
        const columnFilters = Array.isArray(ch)
            ? ch.filter(i => i.props.noodlNode.model?.type.split('.')[1] === 'ColumnFilter')
            : ch?.props.noodlNode.model?.type.split('.')[1] === 'ColumnFilter'
                ? [ch]
                : null

        return columnsDef.map((column, columnIdx) => {
            if (!column.accessor) column.accessor = `${columnIdx}`

            const columnCell = columnCells?.find(i => i.props.noodlNode.props.table2ColumnIndex === columnIdx)

            // Sort
            if (!sort.enabled) {
                delete column.sortable
                delete column.sort
            } else {
                if (sort.type === 'backend') delete column.sort?.func
                if (column.sort) column.sortable = true
            }

            // Filter
            if (!filter.enabled) {
                delete column.filter
                delete column.filterFunc
                delete column.filtering
            } else {
                if (filter.type === 'backend') delete column.filterFunc

                const columnFilter = columnFilters?.find(i => i.props.noodlNode.props.table2ColumnIndex === columnIdx)
                if (columnFilter) {
                    columnFilter.props.noodlNode.props.innerProps = { tableId }
                    if (filter.type === 'frontend') setFilterFunc(columnIdx, column.filterFunc)

                    columnFilter.props.noodlNode.props.innerProps.forceUpdate = forceUpdate
                    column.filter = ({ close }: { close: () => void }) => {
                        columnFilter.props.noodlNode.props.innerProps.close = close
                        return columnFilter
                    }
                    column.filtering = getColumnFilter(columnIdx)?.state
                }
            }

            column.render = (record) => {
                const value = column.getValue ? column.getValue(record) : window.R.utils.getValue.v8(record, column.accessor)

                const boxProps = typeof column.boxProps === 'function'
                    ? column.boxProps(record)
                    : column.boxProps

                if (columnCell) {
                    columnCell.props.noodlNode.props.record = record
                    return expansion.enabled && column.expander
                        ? <Box {...boxProps}>{
                            Expander(
                                record.id, cloneElement(columnCell, { innerProps: { record } }), expandedRecordIds, setExpandedRecordIds,
                                onRowClick, classes, cx, customProps?.expander?.chevronIcon, customProps?.expander?.actionIcon,
                                expansion.allowMultiple
                            )
                        }</Box>
                        : <Box {...boxProps}>{cloneElement(columnCell, { innerProps: { record } })}</Box>
                } else {
                    return expansion.enabled && column.expander
                        ? <Box {...boxProps}>{
                            Expander(
                                record.id, value, expandedRecordIds, setExpandedRecordIds,
                                onRowClick, classes, cx, customProps?.expander?.chevronIcon, customProps?.expander?.actionIcon,
                                expansion.allowMultiple
                            )
                        }</Box>
                        : <Box {...boxProps}>{value}</Box>
                }
            }

            return column
        })
    }, [columnsDef, expandedRecordIds, filters])

    // Sort
    const { sortStatus, setSortStatus } = useSort(noodlNode, sort, columns)
    const SortedIcon = R.libs.icons[sort.sortedIcon || 'IconArrowUp']
    const UnsortedIcon = R.libs.icons[sort.unsortedIcon || 'IconSelector']

    // Input signals
    useImperativeHandle(ref, () => ({
        table2ResetSingleSelection() { setSelectedRecord(tableId, undefined) },
        table2ResetMultiSelection() { setSelectedRecords(tableId, []) },
        table2ResetSort() { setSortStatus(undefined) },
        table2ResetFilters() { resetFilters(); forceUpdate() },
        table2ExpandAll() { setExpandedRecordIds(items?.map(i => i.id) || []) },
        table2UnexpandAll() { setExpandedRecordIds([]) }
    }), [tableId, items])

    // Table styles
    const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
    const [animation, setAnimation] = useState(false)
    useEffect(() => {
        if (!fetching && !animation && tableStyles.animation)
            setTimeout(() => setAnimation(true), 100)
    }, [fetching])

    // Row styles
    const { classes, cx } = useRowStyles(rowStyles)

    //@ts-ignore
    return <ScopeProvider scope={TableFilterScope} value={tableId}><Box w={dimensions.width}><DataTable<Item>
        columns={columns}
        records={getRecords(filter, columns, items, getColumnFilter, runFilterFunc, fetching, sortStatus)}
        onRowClick={
            // Single selection
            selection.single.enabled && onRowClick === 'singleSelection'
                ? (item) => {
                    if (selectedRecord?.id === item.id && selection.single.unselectable) setSelectedRecord(tableId, undefined)
                    else setSelectedRecord(tableId, item)
                }
                : undefined
        }
        // Multi selection
        selectedRecords={selection.multi.enabled ? selectedRecords : undefined}
        // selectedRecords={ selection.multi.enabled
        //     ? useScopeStates 
        //         ? newSelectedRecords
        //         : selectedRecords
        //     :undefined
        // }
        onSelectedRecordsChange={selectedRecords => setSelectedRecords(tableId, selectedRecords)}
        // Sort
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        sortIcons={{
            sorted: SortedIcon && <SortedIcon size={14} {...customProps?.sortedIcon} />,
            unsorted: UnsortedIcon && <UnsortedIcon size={14} {...customProps?.unsortedIcon} />,
        }}
        // Expansion
        rowExpansion={
            expansion.enabled
                ? {
                    allowMultiple: expansion.allowMultiple,
                    trigger: onRowClick === 'expansion' ? 'click' : 'never',
                    expanded: { recordIds: expandedRecordIds, onRecordIdsChange: setExpandedRecordIds },
                    content: ({ record }) => {
                        if (expansionRow) expansionRow.props.noodlNode.props.innerProps = { record, tableId } // MD add tableId
                        return expansionRow
                    },
                    collapseProps: { transitionDuration: 50, ...customProps?.collapseProps },
                } : undefined
        }
        // Table styles
        bodyRef={tableStyles.animation ? bodyRef : undefined}
        // Row styles
        rowClassName={({ id }) => (cx(
            { [classes.row]: rowStyles.enabled },
            { [classes.striped]: rowStyles.enabled && rowStyles.striped },
            { [classes.multiSelected]: rowStyles.enabled && selection.multi.enabled && selectedRecords?.map(i => i.id).includes(id) },
            { [classes.singleSelected]: rowStyles.enabled && selection.single.enabled && selectedRecord?.id === id }
        ))}
        sx={expansion.enabled && !rowStyles.rowBorders ? { '&&': { 'tbody tr td': { borderTop: 'none' } } } : undefined}
        // States
        fetching={fetching}
        tableId={tableId}
        {...libProps}
        {...customProps}
    /></Box></ScopeProvider>
})
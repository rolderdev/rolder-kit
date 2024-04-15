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

import { useAtom } from "jotai" // useAtom, read as readJotaiAtom, , useAtomValue, useSetAtom
import {
    tableSelectionScopeAtom,
    tableSelectionClickItemIdAtom,
    tableSelectionChildIdsByParentIdAtom,
    // tableselectionByDBClassAtom,
    tableSelectionScopeInternalAtom,
    tableHandlerAtom
} from "@packages/scope";

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
        // Если это не разворачиваемая строка с множественным выбором,то хакаем
        if (!expansion.enabled && !selection.multi.enabled) {
            // console.log("setTimeout(() => forceUpdate())")
            setTimeout(() => forceUpdate())
        }
    }, [items])

    const tableId = useId()

    // Single selection
    const { selectedRecord, setSelectedRecord } = useSingleSelection(noodlNode, tableId, selection.single, items)
    // Multi selection
    const { selectedRecords, setSelectedRecords } = useMultiSelection(noodlNode, tableId, selection.multi, items)

    //========scopeMultiSelection============================================================
    // СТРУКТУРА
    // --- Подтягиваем хуки
    // --- Если включен expension и multiselection, то берем состояния select из tableSelectionScope
    // --- И все остальные проверки только если включен expension и multiselection

    //====Хуки, которые понядобятся при работе с tableSelectionScope====
    // Молекула с родительским item
    const tableCellMol = useTableCellScope()
    // Хуки для атомов для tableSelectionScope
    const [tableSelectionScopeValue, setTableSelectionScopeValue] = useAtom(tableSelectionScopeAtom)
    const [tableSelectionClickItemIdValue, setTableSelectionClickItemIdValue] = useAtom(tableSelectionClickItemIdAtom)
    const [tableSelectionChildIdsByParentIdValue, setTableSelectionChildIdsByParentIdValue] = useAtom(tableSelectionChildIdsByParentIdAtom)
    // const [tableSelectionByDBClassValue, setTableSelectionByDBClassValue] = useAtom(tableselectionByDBClassAtom)
    const [tableSelectionScopeInternalValue, setTableSelectionScopeInternalValue] = useAtom(tableSelectionScopeInternalAtom)
    const [tableHandlerAtomValue] = useAtom(tableHandlerAtom) //setTableHandlerAtomValue

    // id родительской таблицы
    // const parentTableId = tableCellMol?.parentTableId ? tableCellMol.parentTableId : undefined
    // id родительской записи, а для 1 уровня - root
    const parentTableItemId = tableCellMol?.id || 'root'

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Самая важная часть - если useScopeStates: false, то модули ниже, не отрабатывают
    // Флаг о том, что состояния берем из scope
    const useScopeStates = expansion.enabled && selection.multi.enabled

    console.log("/////////////////// уровень:", items?.[0]?.content?.level)
    // console.log("Перерендериваем tableId:", tableId)
    // console.log("tableSelectionScopeInternalValue", tableSelectionScopeInternalValue)
    // console.log("tableSelectionChildIdsByParentIdValue", tableSelectionChildIdsByParentIdValue)

    // Если в молекуле ещё нет связки id текущей таблицы и id родительской таблицы
    // то создаем эту связь
    useEffect(() => {
        // console.log("******************************************************")
        // console.log("Сработал useEffect(() => { на tableId и Items")

        if (useScopeStates && tableId !== '' && tableId !== undefined) {
            if (!tableSelectionScopeInternalValue['allTableIdList'].includes(tableId)) {
                tableSelectionScopeInternalValue['allTableIdList'].push(tableId)
            }

            // После раскрытия таблицы, items появляются не сразу, поэтому при их изменении, добавляем их в scope
            if (items.length > 0) {

                // Запишем id itemов по id своего родителя
                // Если запись с родителеме отсутсвует, то создаем пустой массив
                // а если будет, то добавим информацию к данным с братской таблицы
                if (!tableSelectionChildIdsByParentIdValue[parentTableItemId]) {
                    tableSelectionChildIdsByParentIdValue[parentTableItemId] = []
                }

                // Запишем items, если их ещё нет, и при первом запуске наследуем статусы от своих родителей
                items.forEach(item => {

                    tableSelectionChildIdsByParentIdValue[parentTableItemId]?.push(item.id)
                    tableSelectionScopeInternalValue['tableIdByItemId'][item.id] = tableId

                    // Если есть id и его ещё нет в scope
                    if (
                        item?.id
                        && parentTableItemId !== undefined
                        && parentTableItemId !== 'root'
                        && tableSelectionScopeValue[item.id] === undefined
                    ) {
                        // Если статус родителя не indeterminated, то наследуем
                        if (tableSelectionScopeValue[parentTableItemId] !== 'indeterminated') {
                            tableSelectionScopeValue[item.id] = tableSelectionScopeValue[parentTableItemId]
                        }
                        // А если родительский item indeterminated, и нет записи в scope
                        // а она может быть при повторном разворачивании
                        // то - notSelected
                        else {
                            if (tableSelectionScopeValue[item.id] === undefined) {
                                tableSelectionScopeValue[item.id] = 'notSelected'
                            }
                        }
                    }
                    // Если нет родителя
                    else {
                        // И нет записи в scope
                        if (tableSelectionScopeValue[item.id] === undefined) {
                            tableSelectionScopeValue[item.id] = 'notSelected'
                        }
                    }
                })

                setTableSelectionScopeValue(tableSelectionScopeValue)
                setTableSelectionChildIdsByParentIdValue(tableSelectionChildIdsByParentIdValue)
            }
        }
        sendOutput(props.noodlNode, 'tableId', tableId)

        return () => {
            // При размонтировании (сворачивании) таблицы, удаляем её id из scope
            tableSelectionScopeInternalValue['allTableIdList'] = tableSelectionScopeInternalValue['allTableIdList'].filter(iTableId => iTableId !== tableId)

            setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)
        }

    }, [tableId, items])

    // console.log("обрабатываю уровень", items?.[0]?.content?.level)

    // Если используем scope
    if (useScopeStates) {

        // Если записи уже попали в scope на этапе выше, при первом их получении с наследованием от родителя,
        // то можно запускать обработку массива выбранных
        const itemsInScope = items.length > 0
            ? tableSelectionScopeValue[items?.[0]?.id] !== undefined
                ? true
                : false
            : false

        // Функция, которая изменяет массивы выбранных и indeterminated на основании scope
        const refreshScopeValuesBySelect = () => {

            if (items.length > 0 && itemsInScope) {

                // Копируем имеющиеся выделенные записи, чтобы перезаписывать отфильтрованный результат
                let newSelectedRecords = [...selectedRecords]

                if (itemsInScope) {

                    let changedSelection = false
                    // Перебираем элементы текущей таблицы
                    items.forEach(item => {

                        // -----
                        // Если статус selected, то добавляем в массив выьранных
                        if (tableSelectionScopeValue[item.id] === 'selected') {
                            // Если item ещё не в массиве выбранных, то добавляем
                            if (!newSelectedRecords.find(sItem => sItem.id === item.id)) {
                                newSelectedRecords.push(item)
                                changedSelection = true
                            }
                        }
                        // А иначе удаляем из массива
                        else {
                            // Если item в массиве выбранных, то удаляем
                            // А без этой проверки будет бесконечныфй цикл
                            if (newSelectedRecords.find(sItem => sItem.id === item.id)) {
                                newSelectedRecords = newSelectedRecords.filter(record => record.id !== item.id)
                                changedSelection = true
                            }
                        }
                    })

                    if (changedSelection) {
                        setSelectedRecords(tableId, newSelectedRecords)
                    }
                }
            }
        }

        refreshScopeValuesBySelect()

        // // и обновим статусы
        // const forceUpdateThisTable = () => {
        //     forceUpdate()
        // }
        // // Сохраняем функцию ререндер в атом, под своим tableId

        // if (tableHandlerAtomValue[tableId] === undefined && tableId && items.length > 0) { //  && items.length > 0// Если items.length>0, чтобы не перерендеривать пустые таблицы
        //     setTableHandlerAtomValue((handlers) => ({ ...handlers, [tableId]: forceUpdateThisTable }))
        // }
    }

    // Обработчик входящего массива multiSelection
    useEffect(() => {

        if (useScopeStates && items.length > 0) {

            // if (
            //     selection.multi.selectedItems?.length > 0
            // ) {
            // Так как в репиттере находится много таблиц, они все будут проверяться
            // этим массивом и элементов таблиц в нем не окажется и везде снимутся селекты,
            // кроме нужной таблицы
            // Если хоть один элемент есть в массиве выбранных
            // то это та таблица, которой меняем статус
            let arrayForThisTable = false
            items?.forEach(item => {
                if (selection.multi.selectedItems?.find(fItem => fItem.id === item.id)) {
                    arrayForThisTable = true
                }
            })

            if (arrayForThisTable) {
                items?.forEach(item => {
                    if (selection.multi.selectedItems?.find(fItem => fItem.id === item.id)) {
                        tableSelectionScopeValue[item.id] = 'selected'
                    }
                    else {
                        tableSelectionScopeValue[item.id] = 'notSelected'
                    }
                    // Имитируем нажатие на item, если там ещё нет
                    if (!tableSelectionClickItemIdValue.includes(item.id)) {
                        tableSelectionClickItemIdValue.push(item.id)
                    }
                    setTableSelectionScopeValue(tableSelectionScopeValue)
                    setTableSelectionClickItemIdValue(tableSelectionClickItemIdValue)
                    setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)
                })

                // Запускаем tableSelectionScope
                try {
                    tableHandlerAtomValue['selectionScope']()
                    // console.log("Вызывал перерендер selectionScope")
                    // console.log("tableHandlerAtomValue['selectionScope']", tableHandlerAtomValue['selectionScope'])

                } catch (e) {
                    console.log("У таблиц включен expension и multiselect, но они не оборнуты в selectionScope!")
                    console.log("Разместите иерархичные таблицы под нодой tableSelectionScope!!!")
                    console.error(e)
                }
            }
        }
    }, [selection.multi.selectedItems])

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
        table2ResetMultiSelection() {
            // Записываем в scope, что все items: "notSelected"
            items.forEach(item => {
                tableSelectionScopeValue[item.id] = "notSelected"
            })
            setTableSelectionScopeValue(tableSelectionScopeValue)
            // setTableSelectionByDBClassValue(tableSelectionByDBClassValue)
            setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)
            setSelectedRecords(tableId, [])
        },
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

    // Ошибки с выводом в таблицу
    // emptyState: <Text color={props.dataFetchError || props.dataScopeError ? 'red' : 'dimmed'} size="sm">
    //         {props.dataFetchError ? 'Ошибка загрузки данных' : 'Записей не найдено'}
    //     </Text>,

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
        parentTableItemId={parentTableItemId}
        {...libProps}
        {...customProps}
    /></Box></ScopeProvider>
})

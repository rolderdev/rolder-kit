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
import {
    tableSelectionScopeAtom,
    tableselectionByDBClassAtom,
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
        setTimeout(() => forceUpdate())
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
    const [tableSelectionByDBClassValue, settableSelectionByDBClassValue] = useAtom(tableselectionByDBClassAtom)
    const [tableSelectionScopeInternalValue, setTableSelectionScopeInternalValue] = useAtom(tableSelectionScopeInternalAtom)
    const [tableHandlerAtomValue, setTableHandlerAtomValue] = useAtom(tableHandlerAtom)

    // id родительской таблицы
    const parentTableId = tableCellMol?.parentTableId ? tableCellMol.parentTableId : undefined
    // id родительской записи
    const parentTableItemId = tableCellMol?.id

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Самая важная часть - если useScopeStates: false, то модули ниже, не отрабатывают
    // Флаг о том, что состояния берем из scope
    const useScopeStates = expansion.enabled && selection.multi.enabled

    console.log("/////////////////// уровень:", items?.[0]?.content?.level)
    console.log("Перерендериваем tableId:", tableId)
    console.log("tableSelectionScopeInternalValue", tableSelectionScopeInternalValue)

    // Если в молекуле ещё нет связки id текущей таблицы и id родительской таблицы
    // то создаем эту связь
    useEffect(() => {
        console.log("******************************************************")
        console.log("Сработал useEffect(() => { на tableId и Items")

        if (useScopeStates && tableId !== '' && tableId !== undefined) {
            if (!tableSelectionScopeInternalValue['parentTableIdByTableId'][tableId]) {
                // Создаем запись в молекулу о том, у какой таблицы какой item является родительским
                if (tableId && (typeof parentTableId === 'string')) {
                    tableSelectionScopeInternalValue['parentTableIdByTableId'][tableId] = parentTableId
                }
                // Создаем запись в молекулу о том, у какой таблицы какой item является родительским
                if (tableId && parentTableItemId) {
                    tableSelectionScopeInternalValue['tableParentItemByTableId'][tableId] = parentTableItemId
                }
            }

            if (!tableSelectionScopeInternalValue['allTableIdList'].includes(tableId)) {
                tableSelectionScopeInternalValue['allTableIdList'].push(tableId)
            }


            // После раскрытия таблицы, items появляются не сразу, поэтому при их изменении, добавляем их в scope
            if (items.length > 0) {

                // Проверим статус каждой записи и выберем статус для голоса от таблицы
                let itemsVotingResults: ("selected" | "notSelected" | "indeterminated" | undefined)[] = []

                // Наследуем статус от родителей
                items.forEach(item => {
                    if (item && parentTableItemId && tableSelectionScopeValue[item.id] === undefined) {
                        // Если статус родителя не indeterminated
                        if (tableSelectionScopeValue[parentTableItemId] !== 'indeterminated') {
                            tableSelectionScopeValue[item.id] = tableSelectionScopeValue[parentTableItemId]
                        }
                        // А если родительский item indeterminated, и нет записи в scope
                        // а она может быть при повторном разворачивании
                        // то -notSelected
                        else {
                            if (tableSelectionScopeValue[item.id] === undefined) {
                                tableSelectionScopeValue[item.id] = 'notSelected'
                            }
                        }
                    }
                    // Если нет родителя
                    else if (!parentTableItemId) {
                        // И нет записи в scope
                        if (tableSelectionScopeValue[item.id] === undefined) {
                            tableSelectionScopeValue[item.id] = 'notSelected'
                        }
                    }
                    // Так как после открытия таблицы items и tableId обрабатываются как новые, то
                    // Каждый раз перепроверяем статусы из scope и на их основе решаем, за какой статус отца мы голосуем
                    // А так как id items фактически есть в scope, то они могу голосовать за отца
                    // Перебираем всех братьев и проверяем их статусы (как они голосуют за статус родительского item)
                    itemsVotingResults.push(tableSelectionScopeValue[item.id])
                })
                
                // Если среди голосов все selected, то и голос от таблицы selected
                if (
                    !itemsVotingResults.includes("indeterminated")
                    && !itemsVotingResults.includes("notSelected")
                ) {
                    tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][tableId] = "selected"
                }
                // Если среди голосов все notSelected, то и голос от таблицы notSelected
                else if (
                    !itemsVotingResults.includes("indeterminated")
                    && !itemsVotingResults.includes("selected")
                ) {
                    tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][tableId] = "notSelected"
                }
                // а если есть и ыудусеув, и notSelected, и голос от таблицы indeterminated
                else {
                    tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][tableId] = "indeterminated"
                }

                // И говорим, что нужно перерендерить эту таблицу,
                // чтобы записанные в scope статусы обновились у таблицы
                // tableSelectionScopeInternalValue['forRenderTableId']['currentTableId'] = tableId
                tableSelectionScopeInternalValue['forRenderTableId'] = {
                    // Если не его родитель, то не удаляем
                    parentTableId: undefined,
                    // tableSelectionScopeInternalValue['forRenderTableId']['parentTableId'] !== parentTableId
                    //     ? undefined
                    //     : tableSelectionScopeInternalValue['forRenderTableId']['parentTableId'],
                    // tableSelectionScopeInternalValue['parentTableIdByTableId'][tableId], //
                    currentTableId: undefined,
                    newTableId: [...tableSelectionScopeInternalValue['forRenderTableId']['newTableId'], tableId], // Так как таблицу только открыли, нужно перерендерить
                    childTableId: []//Object.keys(tableSelectionScopeInternalValue['parentTableIdByTableId']).filter(key => tableSelectionScopeInternalValue['parentTableIdByTableId'][key] === tableId),
                }
                setTableSelectionScopeValue(tableSelectionScopeValue)
            }
            // Если нет записей, то таблица голосует так, как скажет родитель
            else {
                tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][tableId] = tableSelectionScopeValue[parentTableItemId]
            }

            setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)

        }
        sendOutput(props.noodlNode, 'tableId', tableId)

        return () => {
            // Удаляем запись из молекулы о том, у какой таблицы какой item является родительским
            delete tableSelectionScopeInternalValue['parentTableIdByTableId'][tableId]
            // Удаляем запись из молекулы о том, у какой таблицы какой item является родительским
            delete tableSelectionScopeInternalValue['tableParentItemByTableId'][tableId]
            // Удаляем запись из молекулы о том, нужно ли рендерить таблицу
            tableSelectionScopeInternalValue['allTableIdList'] = tableSelectionScopeInternalValue['allTableIdList'].filter(iTableId => iTableId !== tableId)

            setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)
        }

    }, [tableId, items])

    // console.log("обрабатываю уровень", items?.[0]?.content?.level)

    if (items.length === 0) {
        if (tableSelectionScopeInternalValue['forRenderTableId']['childTableId'].includes(tableId)) {
            tableSelectionScopeInternalValue['forRenderTableId']['childTableId'] = tableSelectionScopeInternalValue['forRenderTableId']['childTableId'].filter(childTableId => childTableId !== tableId)
            setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)
        }

        // tableSelectionScopeInternalValue['forRenderTableId'] = {
        //     // Если наследовать, то свалится в бесконечный цикл
        //     parentTableId: tableSelectionScopeInternalValue['forRenderTableId']['parentTableId'], //  undefined, // tableSelectionScopeInternalValue['parentTableIdByTableId'][tableId],// tableSelectionScopeInternalValue['parentTableIdByTableId'][tableId], //
        //     // Если это был currentTableId, то он выключается из рендера, чтобы не свалитсь в бесконечнцый цикл
        //     currentTableId: tableId === tableSelectionScopeInternalValue['forRenderTableId']['currentTableId']
        //         ? undefined
        //         : tableSelectionScopeInternalValue['forRenderTableId']['currentTableId'],
        //     // Удаляем из массива новых таблиц на рендер, так как вот он и отрендерился
        //     newTableId: tableSelectionScopeInternalValue['forRenderTableId']['newTableId'].includes(tableId)
        //         ? tableSelectionScopeInternalValue['forRenderTableId']['newTableId'].filter(fTableId => fTableId !== tableId)
        //         : tableSelectionScopeInternalValue['forRenderTableId']['newTableId'],
        //     // childTableId не очищаем, так как в нем могут быть дети брата
        //     childTableId: tableSelectionScopeInternalValue['forRenderTableId']['childTableId'].includes(tableId)
        //         ? tableSelectionScopeInternalValue['forRenderTableId']['childTableId'].filter(childTableId => childTableId !== tableId)
        //         : tableSelectionScopeInternalValue['forRenderTableId']['childTableId']
        // }
    }

    // Если записи уже попали в scope на этапе выше, при первом их получении с наследованием от родителя,
    // то можно запускать обработку массива выбранных
    const itemsInScope = items.length > 0
        ? tableSelectionScopeValue[items?.[0]?.id] !== undefined
            ? true
            : false
        : false

    // Если используем scope
    if (useScopeStates && itemsInScope) {
        // Функция, которая изменяет массивы выбранных и indeterminated на основании scope
        const refreshScopeValuesBySelect = () => {

            // console.log("Перерендериваем tableId:", tableId)
            // console.log("Перерендериваем уровень:", items?.[0]?.content?.level)
            // console.log("tableSelectionScopeInternalValue", tableSelectionScopeInternalValue)

            if (items.length > 0) {
                // Флаг о том, были ли изменения
                let hasChange = false

                // Копируем имеющиеся выделенные записи, чтобы перезаписывать отфильтрованный результат
                let newSelectedRecords = [...selectedRecords]

                // Если это таблица, в которой было нажатие или её родитель, то не наследуем статусы
                const getByParent = tableSelectionScopeInternalValue['forRenderTableId']['parentTableId'] === tableId
                    || tableSelectionScopeInternalValue['forRenderTableId']['currentTableId'] === tableId
                    ? false
                    : true

                if (itemsInScope) {
                    // Перебираем элементы текущей таблицы
                    items.forEach(item => {
                        // Получаем статус записи из scope
                        let tableSelectionScopeItem: "selected" | "notSelected" | "indeterminated" | undefined
                        // Если есть родительский item и стоит флаг, что наследуем от родителя
                        if (parentTableItemId && getByParent) {
                            // Если родитель выбран или не выбран, то наследуем статус
                            if (
                                tableSelectionScopeValue[parentTableItemId] === "selected"
                                || tableSelectionScopeValue[parentTableItemId] === "notSelected"
                            ) {
                                tableSelectionScopeItem = tableSelectionScopeValue[parentTableItemId]
                            }
                            // Иначе (если родитель indeterminated), получаем статус записи из scope
                            else {
                                tableSelectionScopeItem = tableSelectionScopeValue[item.id]
                            }
                        }
                        // Если родительского item нет, то получаем статус записи из scope
                        else {
                            tableSelectionScopeItem = tableSelectionScopeValue[item.id]
                        }
                        // Если после проверок оказалось, что статус не найден,
                        // то проверяем по наличию в массиве выбранных
                        if (!tableSelectionScopeItem) {
                            tableSelectionScopeItem = newSelectedRecords.length
                                ? newSelectedRecords?.find(record => record.id === item.id)
                                    ? "selected"
                                    : "notSelected"
                                : "notSelected"
                            tableSelectionScopeValue[item.id] = tableSelectionScopeItem
                            hasChange = true
                        }
                        // -----
                        // По полученному статусу добавляем или удаляем item в/из
                        // массива выбранных записей и массива indeterminated
                        if (tableSelectionScopeItem === 'selected') {
                            // Если статус в scope не соответствует полученному
                            if (tableSelectionScopeValue[item.id] !== 'selected') {
                                tableSelectionScopeValue[item.id] = 'selected'
                                hasChange = true
                            }
                            // Если item ещё не в массиве выбранных, то добавляем
                            if (!newSelectedRecords.find(sItem => sItem.id === item.id)) {
                                newSelectedRecords.push(item)
                            }
                            // Если запись в массиве indeterminated, то удаляем из него
                            if (tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].includes(item.id)) {
                                tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'] = tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].filter(itemId => itemId !== item.id)
                                hasChange = true
                            }
                        }
                        else if (tableSelectionScopeItem === "notSelected") {
                            // Если статус в scope не соответствует полученному
                            if (tableSelectionScopeValue[item.id] !== 'notSelected') {
                                tableSelectionScopeValue[item.id] = 'notSelected'
                                hasChange = true
                            }
                            // Если item в массиве выбранных, то удаляем
                            if (newSelectedRecords.find(sItem => sItem.id === item.id)) {
                                newSelectedRecords = newSelectedRecords.filter(record => record.id !== item.id)
                            }
                            // Если запись в массиве indeterminated, то удаляем из него
                            if (tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].includes(item.id)) {
                                tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'] = tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].filter(itemId => itemId !== item.id)
                                hasChange = true
                            }
                        }
                        // А иначе статус будет indeterminated
                        else {
                            // Если статус в scope не соответствует полученному
                            if (tableSelectionScopeValue[item.id] !== 'indeterminated') {
                                tableSelectionScopeValue[item.id] = 'indeterminated'
                                hasChange = true
                            }
                            // Если item в массиве выбранных, то удаляем
                            if (newSelectedRecords.find(sItem => sItem.id === item.id)) {
                                newSelectedRecords = newSelectedRecords.filter(record => record.id !== item.id)
                            }
                            // Если itemId ещё нет в массиве indeterminated, то добавляем
                            if (!tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].includes(item.id)) {
                                tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].push(item.id)
                                hasChange = true
                            }
                            // Так как у нас хоть один item indeterminated, то и отец indeterminated
                            if (parentTableItemId) {
                                tableSelectionScopeValue[parentTableItemId] = "indeterminated"
                                hasChange = true
                            }
                        }
                    })

                    // По итогу анализа состояний select всех элементов таблицы
                    // делаем вывод о состоянии родительского item
                    // Если мы не наследуем, то перезаписываем отца
                    // Выбор статуса родительского item делается по результатам голосования каждой дочерней таблицы
                    if (parentTableItemId) { //  && !parentIsIndeterminated  && !getByParent

                        // Если есть записи
                        if (items.length > 0) {
                            // Узнаем статусы записей и проголосуем за статус родителя
                            const itemsIds = items.map(item => item.id)
                            // Проверим статус каждой записи и выберем статус для голоса от таблицы
                            let itemsVotingResults: ("selected" | "notSelected" | "indeterminated" | undefined)[] = []
                            // Получаем элементов
                            itemsIds?.forEach(itemId => {
                                // Записываем в массив голоса всех элементов
                                itemsVotingResults.push(tableSelectionScopeValue[itemId])
                            })
                            // Если среди голосов все selected, то и голос от таблицы selected
                            if (
                                !itemsVotingResults.includes("indeterminated")
                                && !itemsVotingResults.includes("notSelected")
                            ) {
                                tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][tableId] = "selected"
                            }
                            // Если среди голосов все notSelected, то и голос от таблицы notSelected
                            else if (
                                !itemsVotingResults.includes("indeterminated")
                                && !itemsVotingResults.includes("selected")
                            ) {
                                tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][tableId] = "notSelected"
                            }
                            // а если есть и ыудусеув, и notSelected, и голос от таблицы indeterminated
                            else {
                                tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][tableId] = "indeterminated"
                            }
                        }
                        // Если нет записей, то таблица голосует так, как скажет родитель
                        else {
                            tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][tableId] = tableSelectionScopeValue[parentTableItemId]
                        }

                        // Записи таблицы голосуют своими статусами за статус родителя,
                        // с которым пойдет на выборы таблица
                        // а если наследовали, то обновляют свой голос так, как сказал отце
                        // if (newSelectedRecords.length === items.length) {
                        //     tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][tableId] = "selected"
                        // }
                        // // Если выбраны не все, то indeterminated
                        // else if (newSelectedRecords.length !== 0 && newSelectedRecords.length !== items.length) {
                        //     tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][tableId] = "indeterminated"
                        // }
                        // // А иначе notSelected
                        // else {
                        //     tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][tableId] = "notSelected"
                        // }

                        // Если мы наследовали от отца, то не нужно перевзвешить его статус,
                        // но голос нужно поменять, согласо статусу отца (это проверка выше)
                        if (!getByParent) {

                            // Перебираем всех братьев и проверяем их статусы (как они голосуют за статус родительского item)
                            const brotherTablesIds = Object.keys(tableSelectionScopeInternalValue['tableParentItemByTableId']).filter(brotheTableId => tableSelectionScopeInternalValue['tableParentItemByTableId'][brotheTableId] === parentTableItemId)
                            // Проверим статус каждого брата и выберем статус для родителя
                            let tablesVotingResults: ("selected" | "notSelected" | "indeterminated" | undefined)[] = []
                            // Получаем голоса братьев
                            brotherTablesIds?.forEach(brotherTableId => {
                                // Записываем в массив голоса всех братьев
                                tablesVotingResults.push(tableSelectionScopeInternalValue['parentTableSelectionStateByTableId'][brotherTableId])
                            })
                            // Если среди голосов все selected, то и отец selected
                            if (
                                !tablesVotingResults.includes("indeterminated")
                                && !tablesVotingResults.includes("notSelected")
                            ) {
                                tableSelectionScopeValue[parentTableItemId] = "selected"
                                // Удаляем отца из массива indeterminated
                                tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'] = tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].filter(itemId => itemId !== parentTableItemId)
                            }
                            // Если среди голосов все notSelected, то и отец notSelected
                            else if (
                                !tablesVotingResults.includes("indeterminated")
                                && !tablesVotingResults.includes("selected")
                            ) {
                                tableSelectionScopeValue[parentTableItemId] = "notSelected"
                                // Удаляем отца из массива indeterminated
                                tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'] = tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].filter(itemId => itemId !== parentTableItemId)
                            }
                            // а если есть и ыудусеув, и notSelected, то отец indeterminated
                            else {
                                tableSelectionScopeValue[parentTableItemId] = "indeterminated"
                                // Если parentTableItemId ещё нет в массиве indeterminated, то добавляем
                                if (!tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].includes(parentTableItemId)) {
                                    tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].push(parentTableItemId)
                                    hasChange = true
                                }
                            }
                        }
                    }
                    // Исправляем массив id на рендеринг
                    // Если id текущей таблицы родительское, то записываем его родителя
                    if (tableSelectionScopeInternalValue['forRenderTableId']['parentTableId'] === tableId) {
                        if (parentTableId) {
                            tableSelectionScopeInternalValue['forRenderTableId']['parentTableId'] = parentTableId
                        }
                        else {
                            tableSelectionScopeInternalValue['forRenderTableId']['parentTableId'] = undefined
                        }
                        hasChange = true
                    }
                    // Удаляем id текущей таблицы, так как она обработалась только что
                    else if (tableSelectionScopeInternalValue['forRenderTableId']['currentTableId'] === tableId) {
                        tableSelectionScopeInternalValue['forRenderTableId']['currentTableId'] = undefined
                        hasChange = true
                    }
                    // Удаляем id текущей таблицы, если это новая, так как она обработалась только что
                    else if (tableSelectionScopeInternalValue['forRenderTableId']['newTableId'].includes(tableId)) {
                        tableSelectionScopeInternalValue['forRenderTableId']['newTableId'] = tableSelectionScopeInternalValue['forRenderTableId']['newTableId'].filter(fTableId => fTableId !== tableId)
                        hasChange = true
                    }
                    // Если id текущей таблицы дочернее, то обновляем массив детей
                    else if (tableSelectionScopeInternalValue['forRenderTableId']['childTableId'].includes(tableId)) {
                        // Удали текущую таблицу из детей, так как она отрендерилась
                        tableSelectionScopeInternalValue['forRenderTableId']['childTableId'] = tableSelectionScopeInternalValue['forRenderTableId']['childTableId']?.filter(iChildTableId => iChildTableId !== tableId)
                        // Добавим своих детей на перерендер
                        const childIds = Object.keys(tableSelectionScopeInternalValue['parentTableIdByTableId']).filter(key => tableSelectionScopeInternalValue['parentTableIdByTableId'][key] === tableId)
                        tableSelectionScopeInternalValue['forRenderTableId']['childTableId'] = [...tableSelectionScopeInternalValue['forRenderTableId']['childTableId'], ...childIds]
                        hasChange = true
                    }

                    setSelectedRecords(tableId, newSelectedRecords)

                    // После того, как мы внесли все необходимые изменения в tableSelectionScopeInternalValue, обновляем его
                    // Только если было изменение, обновляем атом
                    if (hasChange) {
                        if (items?.[0]?.dbClass) {
                            tableSelectionByDBClassValue[items[0]?.dbClass] = newSelectedRecords
                        }
                        setTableSelectionScopeValue(tableSelectionScopeValue)
                        settableSelectionByDBClassValue(tableSelectionByDBClassValue)
                        setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)
                    }

                }
            }
            // А если items пустой, то удаляем tableId из рендера
            // else {

            // }
        }
        // --- Ниже находится блок, отвечающий за перерендер таблиц, у которых произошли изменения
        // Создаем отдельную функцию, экземплары которой связаны с компонентой
        // и вызывая эту функцию по id таблицы, мы перерендерим именно её
        // и обновим статусы
        const forceUpdateThisTable = () => {
            forceUpdate()
        }
        // Сохраняем функцию ререндер в атом, под своим tableId

        if (tableHandlerAtomValue[tableId] === undefined && tableId) { //  && items.length > 0// Если items.length>0, чтобы не перерендеривать пустые таблицы
            setTableHandlerAtomValue((handlers) => ({ ...handlers, [tableId]: forceUpdateThisTable }))
        }

        // Если текущая таблица должна обновить селекты, запускаем
        if (
            tableSelectionScopeInternalValue['forRenderTableId']['parentTableId'] === tableId
            || tableSelectionScopeInternalValue['forRenderTableId']['currentTableId'] === tableId
            || tableSelectionScopeInternalValue['forRenderTableId']['newTableId'].includes(tableId)
            || tableSelectionScopeInternalValue['forRenderTableId']['childTableId'].includes(tableId)
        ) {
            refreshScopeValuesBySelect()
        }

        // Если отец есть в списке на перерендеринг, запускаем
        if (tableSelectionScopeInternalValue['forRenderTableId']['parentTableId'] !== undefined) {
            tableHandlerAtomValue[tableSelectionScopeInternalValue['forRenderTableId']['parentTableId']]()
        }

        //Добавить массив пустых таблиц, и добавлять очищать его, если items нет или есть

        // Если дети есть в очерерди на перерендеринг, запускаем
        // так как дети - это массив, и они могу быть в другой ветке
        if (tableSelectionScopeInternalValue['forRenderTableId']['childTableId'].length > 0) {
            tableSelectionScopeInternalValue['forRenderTableId']['childTableId']?.forEach(iChildTable => {
                try {
                    if (iChildTable && tableHandlerAtomValue[iChildTable] !== undefined) tableHandlerAtomValue[iChildTable]()
                }
                catch (e) {
                    console.error(e)
                }
            })
        }

        // Когда все таблицы обновились, перерендериваем компоненту tableSelectionScope
        if (
            tableSelectionScopeInternalValue['forRenderTableId']['parentTableId'] !== tableId
            || tableSelectionScopeInternalValue['forRenderTableId']['currentTableId'] !== tableId
            || tableSelectionScopeInternalValue['forRenderTableId']['newTableId'].length === 0
            || tableSelectionScopeInternalValue['forRenderTableId']['childTableId'].length === 0
        ) {
            try {
                tableHandlerAtomValue['selectionScope']()
            } catch (e) {
                console.log("У таблиц включен expension и multiselect, но они не оборнуты в selectionScope!")
                console.log("Разместите иерархичные таблицы под нодой tableSelectionScope!!!")
                console.error(e)
            }
        }
        // --- Выше находится блок, отвечающий за перерендер таблиц, у которых произошли изменения
        // }
    }

    // Обработчик входящего массива multiSelection
    useEffect(() => {

        if (useScopeStates && items.length > 0) {

            // Получаем количество выделенных элементов данной таблицы, из записей в scope
            const selectedCount = items?.filter(item => tableSelectionScopeValue[item.id] === 'selected')?.length

            if (
                selectedCount !== selection.multi.selectedItems?.length
                && selection.multi.selectedItems?.length > 0
            ) {
                // Так как в репиттере находится много таблиц, они все будут проверяться
                // этим массивом и элементов таблиц в нем не окажется и везде снимутся селекты,
                // кроме нужной таблицы
                // Сделаем флаг, что если хоть один элемент есть в массиве выбранных
                // то это та таблица, которой меняем статус
                let arrayForThisTable = false
                items?.forEach(item => {
                    if (selection.multi.selectedItems.find(fItem => fItem.id === item.id)) {
                        arrayForThisTable = true
                    }
                })
                // Перебираем записи вносим изменения в scope согласоно массиву извне
                if (arrayForThisTable) {
                    items?.forEach(item => {
                        if (selection.multi.selectedItems.find(fItem => fItem.id === item.id)) {
                            tableSelectionScopeValue[item.id] = 'selected'
                        }
                        else {
                            tableSelectionScopeValue[item.id] = 'notSelected'
                        }
                    })
                }
                // Говорим, что эту таблицу нужно обновить
                tableSelectionScopeInternalValue['forRenderTableId'] = {
                    parentTableId: tableSelectionScopeInternalValue['parentTableIdByTableId'][tableId],
                    currentTableId: tableId,
                    newTableId: [],
                    childTableId: Object.keys(tableSelectionScopeInternalValue['parentTableIdByTableId']).filter(key => tableSelectionScopeInternalValue['parentTableIdByTableId'][key] === tableId),
                }
                setTableSelectionScopeValue(tableSelectionScopeValue)
                setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)
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
            // // Очищаем классовый массив
            // if (items?.[0]?.dbClass) {
            //     tableSelectionByDBClassValue[items[0]?.dbClass] = []
            // }
            // Создаем заявку на перерендер
            tableSelectionScopeInternalValue['forRenderTableId'] = {
                parentTableId: tableSelectionScopeInternalValue['parentTableIdByTableId'][tableId],
                currentTableId: tableId,
                newTableId: [],
                childTableId: Object.keys(tableSelectionScopeInternalValue['parentTableIdByTableId']).filter(key => tableSelectionScopeInternalValue['parentTableIdByTableId'][key] === tableId),
            }
            setTableSelectionScopeValue(tableSelectionScopeValue)
            // settableSelectionByDBClassValue(tableSelectionByDBClassValue)
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
        {...libProps}
        {...customProps}
    /></Box></ScopeProvider>
})

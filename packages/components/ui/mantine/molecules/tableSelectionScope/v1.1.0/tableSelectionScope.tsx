import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import type { Props } from "./types";
import { sendOutput, sendSignal } from "@packages/port-send";
import React from "react";
import { useForceUpdate } from '@mantine/hooks';
import {
    tableSelectionScopeAtom,
    tableSelectionChildIdsByParentIdAtom,
    tableSelectionClickItemIdAtom,
    tableselectionByDBClassAtom,
    tableSelectionScopeInternalAtom,
    tableHandlerAtom
} from "@packages/scope";
import { Provider as JotaiProvider, useAtom } from "jotai"

const HandlerTableSelectionScope = forwardRef(function (props: Props, ref) {

    // Хука дял получения и перезаписывания атома

    const [tableSelectionScopeValue, setTableSelectionScopeValue] = useAtom(tableSelectionScopeAtom)
    const [tableSelectionChildIdsByParentIdValue, setTableSelectionChildIdsByParentIdValue] = useAtom(tableSelectionChildIdsByParentIdAtom)
    const [tableSelectionClickItemIdValue, settableSelectionClickItemIdValue] = useAtom(tableSelectionClickItemIdAtom)
    const [tableSelectionByDBClassValue] = useAtom(tableselectionByDBClassAtom) // , setTableSelectionByDBClassValue
    const [tableSelectionScopeInternalValue, setTableSelectionScopeInternalValue] = useAtom(tableSelectionScopeInternalAtom)
    const [tableHandlerAtomValue, setTableHandlerAtomValue] = useAtom(tableHandlerAtom)

    // console.log("tableHandlerAtomValue", tableHandlerAtomValue)


    const forceUpdate = useForceUpdate()
    const forceUpdateSelectionScope = () => {
        forceUpdate()
    }
    // Чтобы не сваливалось в бесконечный цикл
    if (tableHandlerAtomValue['selectionScope'] === undefined) {
        setTableHandlerAtomValue((handlers) => ({ ...handlers, ['selectionScope']: forceUpdateSelectionScope }))
    }

    console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*")
    console.log("tableSelectionChildIdsByParentIdValue", tableSelectionChildIdsByParentIdValue)
    console.log("tableSelectionClickItemIdValue", tableSelectionClickItemIdValue)

    const makeZaebato = () => {
        // Обновим статус у всех детей нажатого items и их детей
        // const parentItemId = tableSelectionClickItemIdValue['parentItemId']
        const clickedItemId = tableSelectionClickItemIdValue

        // id самого старого предка, которого мы перерендерим, и все его потомки перерендерятся сами
        let grandUltraFatherItemId: string = 'root'

        // Функция, принимающая id текущего элемента и меняющая статус отца
        function reselectParent(currentItemId: string) {

            // Флаг о том, нужно ли перепроверять select отца
            let parentSelectionChanged = false
            
            // Находим id родительского item для текущего item
            let parentItemId: any // = tableSelectionChildIdsByParentIdValue

            for (const parentId in tableSelectionChildIdsByParentIdValue) {
                if (tableSelectionChildIdsByParentIdValue[parentId]?.includes(currentItemId)) {
                    // id отца для текущего item
                    parentItemId = parentId
                    // Так как перебираем в рекурсии, то сюда запишется самый старый предок
                    if (parentId !== 'root' ) grandUltraFatherItemId = parentId
                    break;
                }
            }            

            if (parentItemId !== 'root' && parentItemId !== undefined) {
                // Получаем братьев
                const brothersItems = tableSelectionChildIdsByParentIdValue[parentItemId]

                let tablesVotingResults: ("selected" | "notSelected" | "indeterminated" | undefined)[] = []
                // Получаем голоса братьев
                brothersItems?.forEach(brotherItemId => {
                    // Записываем в массив голоса всех братьев
                    tablesVotingResults.push(tableSelectionScopeValue[brotherItemId])
                })

                // Если среди голосов все selected, то и отец selected
                if (
                    !tablesVotingResults.includes("indeterminated")
                    && !tablesVotingResults.includes("notSelected")
                ) {
                    if (tableSelectionScopeValue[parentItemId] !== "selected") {
                        tableSelectionScopeValue[parentItemId] = "selected"
                        parentSelectionChanged = true
                    }
                    // Удаляем отца из массива indeterminated
                    tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'] = tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].filter(itemId => itemId !== parentItemId)
                }
                // Если среди голосов все notSelected, то и отец notSelected
                else if (
                    !tablesVotingResults.includes("indeterminated")
                    && !tablesVotingResults.includes("selected")
                ) {
                    if (tableSelectionScopeValue[parentItemId] !== "notSelected") {
                        tableSelectionScopeValue[parentItemId] = "notSelected"
                        parentSelectionChanged = true
                    }
                    // Удаляем отца из массива indeterminated
                    tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'] = tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].filter(itemId => itemId !== parentItemId)
                }
                // а если есть и selected, и notSelected, то отец indeterminated
                else {
                    if (tableSelectionScopeValue[parentItemId] !== "indeterminated") {
                        tableSelectionScopeValue[parentItemId] = "indeterminated"
                        parentSelectionChanged = true
                    }
                    // Если parentTableItemId ещё нет в массиве indeterminated, то добавляем
                    if (!tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].includes(parentItemId)) {
                        tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].push(parentItemId)
                    }
                }

                console.log("parentItemId",parentItemId)
                console.log("brothersItems",brothersItems)
                console.log("tableSelectionScopeValue[parentItemId]",tableSelectionScopeValue[parentItemId])
                console.log("tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList']",tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'])

                // Если статус отца сменился, то перепроверяем и его отца
                if (parentSelectionChanged) {
                    // Если это не 1 уровень
                    if (grandUltraFatherItemId !== 'root') reselectParent(parentItemId)
                }
            }
        }

        // Функция, принимающая id родителя и наследующая его состояние
        function reselectChild(parentItemId: string) {
            const childItemsIds = tableSelectionChildIdsByParentIdValue[parentItemId]

            // Так как мы обрабатываем нажатый item, то удаляем его из массив indeterminated
            tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'] = tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList']?.filter(fItemId => fItemId !== parentItemId)

            childItemsIds?.forEach(iChildItemId => {
                // Наследуем статус родительского item
                tableSelectionScopeValue[iChildItemId] = tableSelectionScopeValue[parentItemId]

                // Передаем его своим детям
                reselectChild(iChildItemId)
            })
        }

        reselectParent(clickedItemId)
        reselectChild(clickedItemId)

        // Перерендерим самого старого отца
        if (
            grandUltraFatherItemId !== 'root' 
            && typeof grandUltraFatherItemId === 'string'
        ) {
            if (
                tableHandlerAtomValue[tableSelectionScopeInternalValue['tableIdByItemId'][grandUltraFatherItemId]] !== undefined
            ) {
                tableHandlerAtomValue[tableSelectionScopeInternalValue['tableIdByItemId'][grandUltraFatherItemId]]()
            }
        }
        // if (
        //     grandUltraFatherItemId !== 'root' 
        //     && tableHandlerAtomValue[tableSelectionScopeInternalValue['allTableIdList'][0]] !== undefined
        // ) {
        //     tableHandlerAtomValue[tableSelectionScopeInternalValue['allTableIdList'][0]]()
        // }
        //grandUltraFatherItemId
    }

    makeZaebato()

    setTableSelectionChildIdsByParentIdValue(tableSelectionChildIdsByParentIdValue)
    settableSelectionClickItemIdValue(tableSelectionClickItemIdValue)
    setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)

    // useEffect(() => {


    // },[
    //     tableSelectionChildIdsByParentIdAtom,
    //     tableSelectionClickItemIdAtom,
    //     tableSelectionChildIdsByParentIdValue,
    //     tableSelectionClickItemIdValue
    // ])


    sendOutput(props.noodlNode, 'selectionScope', tableSelectionScopeValue)
    sendOutput(props.noodlNode, 'selectionByDBClass', tableSelectionByDBClassValue)
    sendSignal(props.noodlNode, 'changed')

    useEffect(() => {
        // console.log("Поймали props.newSelectionScope ", props.newSelectionScope)
        if (props.newSelectionScope) {
            setTableSelectionScopeValue(props.newSelectionScope)
            sendOutput(props.noodlNode, 'selectionScope', tableSelectionScopeValue)
        }
    }, [props.newSelectionScope])

    // При внешнем триггере reset очищаем молекулу
    useImperativeHandle(ref, () => ({

        reset() {
            console.log("REF CHILD TRIGGERED")

            // Сбросим селекты у всех записей
            for (const itemId in tableSelectionScopeValue) {
                tableSelectionScopeValue[itemId] = "notSelected"
            }
            setTableSelectionScopeValue(tableSelectionScopeValue)

            // Очистим массив indeterminated
            tableSelectionScopeInternalValue["tableIndeterminatedItemsIdList"] = []
            setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)

            tableHandlerAtomValue[tableSelectionScopeInternalValue['allTableIdList'][0]]()
        },
    }), [])

    return <>{props.children}</>
})

// Что за forwardRef и как он работатет
export default forwardRef(function (props: Props, ref) {

    // При внешнем триггере reset очищаем молекулу
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        reset() {
            console.log("REF PARENT TRIGGERED")
            localRef.current?.reset()
        },
    }), [])

    return <JotaiProvider>
        <HandlerTableSelectionScope
            ref={localRef}
            {...props}
        />
    </JotaiProvider>

})


import { forwardRef, useImperativeHandle, useRef } from "react" // useEffect
import type { Props } from "./types";
import { sendOutput, sendSignal } from "@packages/port-send";
import React from "react";
import { useForceUpdate } from '@mantine/hooks';
import {
    tableSelectionScopeAtom,
    tableselectionByDBClassAtom,
    tableSelectionScopeInternalAtom,
    tableHandlerAtom
} from "@packages/scope";
import { Provider as JotaiProvider, useAtom } from "jotai"

const HandlerTableSelectionScope = forwardRef(function (props: Props, ref) {

    // Хука дял получения и перезаписывания атома

    const [tableSelectionScopeValue, setTableSelectionScopeValue] = useAtom(tableSelectionScopeAtom)
    const [tableSelectionByDBClassValue, settableSelectionByDBClassValue] = useAtom(tableselectionByDBClassAtom)
    const [tableSelectionScopeInternalValue, setTableSelectionScopeInternalValue] = useAtom(tableSelectionScopeInternalAtom)
    const [tableHandlerAtomValue, setTableHandlerAtomValue] = useAtom(tableHandlerAtom)

    // console.log("tableHandlerAtomValue", tableHandlerAtomValue)

    const forceUpdate = useForceUpdate()
    const forceUpdateSelectionScope = () => {
        forceUpdate()
    }
    if (tableHandlerAtomValue['selectionScope'] === undefined) {
        setTableHandlerAtomValue((handlers) => ({ ...handlers, ['selectionScope']: forceUpdateSelectionScope }))
    }

    

    sendOutput(props.noodlNode, 'selectionScope', tableSelectionScopeValue)
    sendOutput(props.noodlNode, 'selectionByDBClass', tableSelectionByDBClassValue)
    sendSignal(props.noodlNode, 'changed')

    // useEffect(() => {
    //     // if (tableSelectionScopeValue['forRenderTableId']['parentTableId'] !== undefined) {
    //     console.log("Сработала useEffect123")
    //     //     tableHandlerAtomValue[tableSelectionScopeValue['forRenderTableId']['parentTableId']]()
    //     // }
    //     // sendOutput(props.noodlNode, 'selectionScope', tableSelectionScopeValue['tableSelectionScope'])
    //     let selectionScope = tableSelectionScopeValue
    //     sendOutput(props.noodlNode, 'selectionScope', selectionScope)

    //     let selectionByDBClass = tableSelectionByDBClassValue
    //     sendOutput(props.noodlNode, 'selectionByDBClass', selectionByDBClass)

    //     sendSignal(props.noodlNode, 'changed')
    // }, [
    //     // tableSelectionScopeAtom,
    //     tableSelectionScopeValue,
    //     tableSelectionByDBClassValue,
    //     tableSelectionScopeInternalValue
    // ])

    // При внешнем триггере reset очищаем молекулу
    useImperativeHandle(ref, () => ({
        
        reset() {
            console.log("REF CHILD TRIGGERED")

            setTableSelectionScopeValue({})
            settableSelectionByDBClassValue({})
            setTableSelectionScopeInternalValue({
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


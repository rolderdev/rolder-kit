import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import type { Props } from "./types";
import { sendOutput, sendSignal } from "@packages/port-send";;
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
    const [tableSelectionByDBClassValue] = useAtom(tableselectionByDBClassAtom) // , setTableSelectionByDBClassValue
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

    useEffect(() => {
        // console.log("Поймали props.newSelectionScope ", props.newSelectionScope)
        if (props.newSelectionScope) {
            setTableSelectionScopeValue(props.newSelectionScope)
            sendOutput(props.noodlNode, 'selectionScope', tableSelectionScopeValue)
            // Говорим, что нужно отрендерить 1 уровень таблиц
            const firstTableId = tableSelectionScopeInternalValue['allTableIdList'][0]
            if (firstTableId) {
                tableSelectionScopeInternalValue['forRenderTableId'] = {
                    parentTableId: undefined,
                    currentTableId: firstTableId,
                    newTableId: [],
                    childTableId: Object.keys(tableSelectionScopeInternalValue['parentTableIdByTableId']).filter(key => tableSelectionScopeInternalValue['parentTableIdByTableId'][key] === firstTableId),
                }
                // if (tableSelectionScopeInternalValue['allTableIdList']?.[0]) tableHandlerAtomValue[tableSelectionScopeInternalValue['allTableIdList'][0]]()
                // forceUpdateSelectionScope()
            }
        }
    }, [props.newSelectionScope])

    // При внешнем триггере reset очищаем молекулу
    useImperativeHandle(ref, () => ({

        reset() {
            // console.log("REF CHILD TRIGGERED")

            // Сбросим селекты у всех записей
            for (const itemId in tableSelectionScopeValue) {
                tableSelectionScopeValue[itemId] = "notSelected"
            }
            setTableSelectionScopeValue(tableSelectionScopeValue)

            // Очистим массив indeterminated
            tableSelectionScopeInternalValue["tableIndeterminatedItemsIdList"] = []
            setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)

            // Говорим, что нужно отрендерить 1 уровень таблиц
            const firstTableId = tableSelectionScopeInternalValue['allTableIdList'][0]
            if (firstTableId) {
                tableSelectionScopeInternalValue['forRenderTableId'] = {
                    parentTableId: undefined,
                    currentTableId: firstTableId,
                    newTableId: [],
                    childTableId: Object.keys(tableSelectionScopeInternalValue['parentTableIdByTableId']).filter(key => tableSelectionScopeInternalValue['parentTableIdByTableId'][key] === firstTableId),
                }
            }
            tableHandlerAtomValue[tableSelectionScopeInternalValue['allTableIdList'][0]]()

            // setTableSelectionScopeInternalValue({
            //     'parentTableIdByTableId': {},                   // Словарь id родительской таблицы для кажждой таблицы
            //     'tableParentItemByTableId': {},                 // Словарь родительских item для кажждой таблицы
            //     'parentTableSelectionStateByTableId': {},       // Словарь со статусами всей таблицы, для принятия статуса отца на основании всех детей
            //     'tableIndeterminatedItemsIdList': [],           // Массив с id запсией, которые должны быть indeterminated
            //     'allTableIdList': [],                           // Массив всех tableId для отладки, так как в объекте они встают по алфовиту
            //     'forRenderTableId': {                           // Массив с id таблиц, которые должны пересмотреть свои селекты, но не от родителей
            //         parentTableId: undefined,
            //         currentTableId: undefined,
            //         newTableId: [],
            //         childTableId: [],
            //     },
            // })
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
            // console.log("REF PARENT TRIGGERED")
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


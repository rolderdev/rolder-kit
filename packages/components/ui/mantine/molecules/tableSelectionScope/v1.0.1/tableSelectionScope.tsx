import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import type { Props } from "./types";
import { sendOutput, sendSignal } from "@packages/port-send";
import React from "react";
import { tableSelectionScopeAtom, tableHandlerAtom } from "@packages/scope";
import { Provider as JotaiProvider, useAtom } from "jotai"

const HandlerTableSelectionScope = forwardRef(function (props: Props, ref) {

    // Хука дял получения и перезаписывания атома
    const [tableSelectionScopeValue, setTableSelectionScopeValue] = useAtom(tableSelectionScopeAtom)
    const [tableHandlerAtomValue] = useAtom(tableHandlerAtom)

    console.log("tableHandlerAtomValue", tableHandlerAtomValue)
    useEffect(() => {
        // if (tableSelectionScopeValue['forRenderTableId']['parentTableId'] !== undefined) {
        //     console.log('PARENT ID IN tableSelectionScope', tableSelectionScopeValue['forRenderTableId']['parentTableId'])
        //     tableHandlerAtomValue[tableSelectionScopeValue['forRenderTableId']['parentTableId']]()
        // }
        // sendOutput(props.noodlNode, 'selectionScope', tableSelectionScopeValue['tableSelectionScope'])
        sendOutput(props.noodlNode, 'selectionScope', {...tableSelectionScopeValue['tableSelectionScope']})
        sendOutput(props.noodlNode, 'selectionByBDClass', {...tableSelectionScopeValue['selectionByBDClass']})
        sendSignal(props.noodlNode, 'changed')
    }, [
        tableSelectionScopeValue['tableSelectionScope'],
        tableSelectionScopeValue['selectionByBDClass']
    ])

    // При внешнем триггере reset очищаем молекулу
    useImperativeHandle(ref, () => ({
        reset() {
            console.log("REF CHILD TRIGGERED")

            setTableSelectionScopeValue({
                tableSelectionScope: {},
                parentTableIdByTableId: {},
                tableParentItemByTableId: {},
                tableIndeterminatedItemsIdList: [],
                allTableIdList: [],
                forRenderTableId: {
                    parentTableId: undefined,
                    currentTableId: undefined,
                    newTableId: undefined,
                    childTableId: [],
                },
                selectionByBDClass: {}
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


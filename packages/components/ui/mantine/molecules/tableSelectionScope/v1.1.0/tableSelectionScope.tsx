import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import type { Props } from "./types";
import { sendOutput, sendSignal } from "@packages/port-send";
import React from "react";
import { useForceUpdate } from '@mantine/hooks';
import {
    type TableSelectionScopeValues,
    type TableSelectionScopeInternal,
    tableSelectionScopeAtom,
    tableSelectionChildIdsByParentIdAtom,
    tableSelectionClickItemIdAtom,
    tableselectionByDBClassAtom,
    tableSelectionScopeInternalAtom,
    tableHandlerAtom
} from "@packages/scope";
import {
    Provider as JotaiProvider,
    createStore,
    useStore
} from "jotai"

const HandlerTableSelectionScope = forwardRef(function (props: Props, ref) {

    // Получаем store из своего provider
    const selectionScopeStore = useStore()

    // Получаем значения атомов из store без подписки на их изменения
    const tableSelectionScopeValue = selectionScopeStore.get(tableSelectionScopeAtom)
    const tableSelectionChildIdsByParentIdValue = selectionScopeStore.get(tableSelectionChildIdsByParentIdAtom) // setTableSelectionChildIdsByParentIdValue
    const tableSelectionClickItemIdValue = selectionScopeStore.get(tableSelectionClickItemIdAtom)
    const tableSelectionByDBClassValue = selectionScopeStore.get(tableselectionByDBClassAtom) // , setTableSelectionByDBClassValue
    const tableSelectionScopeInternalValue = selectionScopeStore.get(tableSelectionScopeInternalAtom)
    const tableHandlerAtomValue = selectionScopeStore.get(tableHandlerAtom)

    // Задаем функции, по перезаписыванию значений в атомах данного store
    const setTableSelectionScopeValue = (value: TableSelectionScopeValues) => { selectionScopeStore.set(tableSelectionScopeAtom, value) }
    const setTableSelectionClickItemIdValue = (value: string[]) => { selectionScopeStore.set(tableSelectionClickItemIdAtom, value) }
    const setTableSelectionScopeInternalValue = (value: TableSelectionScopeInternal) => { selectionScopeStore.set(tableSelectionScopeInternalAtom, value) }
    const setTableHandlerAtomValue = (value: { [tableId: string]: () => void }) => { selectionScopeStore.set(tableHandlerAtom, value) }


    // console.log("tableSelectionScopeValue", tableSelectionScopeValue)
    // console.log("tableSelectionChildIdsByParentIdValue", tableSelectionChildIdsByParentIdValue)
    // console.log("tableSelectionClickItemIdValue", tableSelectionClickItemIdValue)
    // console.log("tableSelectionByDBClassValue", tableSelectionByDBClassValue)
    // console.log("tableSelectionScopeInternalValue", tableSelectionScopeInternalValue)
    // console.log("tableHandlerAtomValue", tableHandlerAtomValue)


    const forceUpdate = useForceUpdate()
    const forceUpdateSelectionScope = () => {
        forceUpdate()
    }

    if (tableHandlerAtomValue['selectionScope'] === undefined) {
        tableHandlerAtomValue['selectionScope'] = forceUpdateSelectionScope
        setTableHandlerAtomValue(tableHandlerAtomValue)
    }

    console.log("/////////////////// уровень: root")

    // Обновим статус у всех детей нажатого items и их детей
    const refresScopeSelection = () => {
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
                    if (parentId !== 'root') grandUltraFatherItemId = parentId
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
                    if (tableSelectionScopeValue[parentItemId] !== "selected" && parentItemId !== 'root') {
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
                    if (tableSelectionScopeValue[parentItemId] !== "notSelected" && parentItemId !== 'root') {
                        tableSelectionScopeValue[parentItemId] = "notSelected"
                        parentSelectionChanged = true
                    }
                    // Удаляем отца из массива indeterminated
                    tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'] = tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].filter(itemId => itemId !== parentItemId)
                }
                // а если есть и selected, и notSelected, то отец indeterminated
                else {
                    if (tableSelectionScopeValue[parentItemId] !== "indeterminated" && parentItemId !== 'root') {
                        tableSelectionScopeValue[parentItemId] = "indeterminated"
                        parentSelectionChanged = true
                    }
                    // Если parentTableItemId ещё нет в массиве indeterminated, то добавляем
                    if (!tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].includes(parentItemId)) {
                        tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].push(parentItemId)
                    }
                }

                // Если это результат внешнего multiSelect, то тоже ищем отца до самого верха
                let itisMultiselect = false
                if (tableSelectionClickItemIdValue?.length > 1) {
                    itisMultiselect = true
                }
                // Если статус отца сменился, то перепроверяем и его отца
                if (parentSelectionChanged || itisMultiselect) {
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

        // Обрабатываем родителей и детей каждого нажатого item
        tableSelectionClickItemIdValue?.forEach(clickedItemId => {
            reselectParent(clickedItemId)
            reselectChild(clickedItemId)
        })

        // Перерендеривае самого старшего отца, который сменил статус
        if (tableHandlerAtomValue[tableSelectionScopeInternalValue['tableIdByItemId'][grandUltraFatherItemId]]) {
            tableHandlerAtomValue[tableSelectionScopeInternalValue['tableIdByItemId'][grandUltraFatherItemId]]()
        }

    }

    // Обрабатываем селекты
    refresScopeSelection()
    // После того, как мы обработали все изменения, очищаем массив с id на изменения
    if (tableSelectionClickItemIdValue?.length > 0) {
        setTableSelectionClickItemIdValue([])
    }

    // Сохраняем изменения в атомах
    delete tableSelectionScopeValue['root']
    setTableSelectionScopeValue(tableSelectionScopeValue)
    setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)

    // Подаем на выходы данные
    // Чтобы не было мутация атома, подаем через {...obj}
    sendOutput(props.noodlNode, 'selectionScope', { ...tableSelectionScopeValue })
    sendOutput(props.noodlNode, 'selectionByDBClass', { ...tableSelectionByDBClassValue })
    sendSignal(props.noodlNode, 'changed')

    useEffect(() => {
        if (props.newSelectionScope) {
            // Меняем статусы на полученные
            for (const itemId in props.newSelectionScope) {
                // Если статсы в scope и извне не равны, то заменяем, и самый 1й 
                // item с измененным статусом записываем как будто нажали
                if (tableSelectionScopeValue[itemId] !== props.newSelectionScope[itemId]) {
                    tableSelectionScopeValue[itemId] = props.newSelectionScope[itemId]
                    if (tableSelectionClickItemIdValue?.length === 0) {
                        setTableSelectionClickItemIdValue([itemId])
                    }
                }

            }

            sendOutput(props.noodlNode, 'selectionScope', tableSelectionScopeValue)
            setTableSelectionScopeValue(tableSelectionScopeValue)

            // Если были измененния в статусах, 
            // то перепроверяем все связанные селекты
            if (tableSelectionClickItemIdValue?.length !== 0) {
                // Обрабатываем селекты
                refresScopeSelection()
            }
            // Запускаем ререндер с 1 уровня
            if (tableHandlerAtomValue[tableSelectionScopeInternalValue['allTableIdList'][0]]) {
                tableHandlerAtomValue[tableSelectionScopeInternalValue['allTableIdList'][0]]()
            }
        }
    }, [props.newSelectionScope])

    // При внешнем триггере reset очищаем молекулу
    useImperativeHandle(ref, () => ({

        reset() {
            // resetScope()
            console.log("REF CHILD TRIGGERED")

            // Сбросим селекты у всех записей
            for (const itemId in tableSelectionScopeValue) {
                tableSelectionScopeValue[itemId] = "notSelected"
            }

            // Очистим массив indeterminated
            tableSelectionScopeInternalValue["tableIndeterminatedItemsIdList"] = []

            setTableSelectionScopeValue(tableSelectionScopeValue)
            setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)


            // forceUpdate()
            tableHandlerAtomValue[tableSelectionScopeInternalValue['allTableIdList'][0]]()
        },
    }), [])

    return <>{props.children}</>
})

// Что за forwardRef и как он работатет
export default forwardRef(function (props: Props, ref) {

    // Создаем store
    // Передаем его дочерним нодам и используем, для получения значений из atom
    const selectionScopeStore = createStore()

    // Инициализируем атомы - загружаем атомы в store
    selectionScopeStore.set(tableSelectionScopeAtom, {})
    selectionScopeStore.set(tableSelectionChildIdsByParentIdAtom, { 'root': [] })
    selectionScopeStore.set(tableSelectionClickItemIdAtom, [])
    selectionScopeStore.set(tableselectionByDBClassAtom, {})
    selectionScopeStore.set(tableSelectionScopeInternalAtom, {
        'tableIdByItemId': {},                          // Словарь, где ключи - id записей, а значения - id таблиц
        'tableIndeterminatedItemsIdList': [],           // Массив с id запсией, которые должны быть indeterminated
        'allTableIdList': [],                           // Массив всех tableId для отладки, так как в объекте они встают по алфовиту
    })
    selectionScopeStore.set(tableHandlerAtom, {})

    // При внешнем триггере reset очищаем молекулу
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        reset() {
            console.log("REF PARENT TRIGGERED")
            localRef.current?.reset()
        },
    }), [])

    return <JotaiProvider store={selectionScopeStore}>
        <HandlerTableSelectionScope
            ref={localRef}
            {...props}
        />
    </JotaiProvider>

})


import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import type { Props } from "./types";
import { sendOutput, sendSignal } from "@packages/port-send";
import React from "react";
import { useForceUpdate } from '@mantine/hooks';
import {
    type TableSelectionScopeValues,
    type TableSelectionChildIdsByParentId,
    type TableSelectionScopeInternal,
    selectionScopeStoreAtom,
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
    useAtom,
    useStore
} from "jotai"



const HandlerTableSelectionScope = forwardRef(function (props: Props, ref) { 
    
    // console.log("========================================================================")
    // console.log("========================================================================")
    // console.log("========================================================================")

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
    const setTableSelectionChildIdsByParentIdValue = (value: TableSelectionChildIdsByParentId) => { selectionScopeStore.set(tableSelectionChildIdsByParentIdAtom, value) }
    const setTableSelectionClickItemIdValue = (value: string[]) => { selectionScopeStore.set(tableSelectionClickItemIdAtom, value) }
    const setTableSelectionScopeInternalValue = (value: TableSelectionScopeInternal) => { selectionScopeStore.set(tableSelectionScopeInternalAtom, value) }
    const setTableHandlerAtomValue = (value: { [tableId: string]: () => void }) => { selectionScopeStore.set(tableHandlerAtom, value) }

    // console.log("ROOOOOTTTT")
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

    // console.log("/////////////////// уровень: root")
    // console.log("tableSelectionScopeValue", tableSelectionScopeValue)
    // console.log("tableSelectionScopeInternalValue", tableSelectionScopeInternalValue)


    // Обновим статус у всех детей нажатого items и их детей
    const refresScopeSelection = () => {

        // console.log("Запустилась функция по обработке статусов")
        // console.log("Запустилась функция по обработке статусов")
        // console.log("Запустилась функция по обработке статусов")
        // console.log("Запустилась функция по обработке статусов")
        // console.log("Запустилась функция по обработке статусов")
        // console.log("Запустилась функция по обработке статусов")
        // console.log("Запустилась функция по обработке статусов")
        // console.log("Запустилась функция по обработке статусов")

        // id самого старого предка, которого мы перерендерим, и все его потомки перерендерятся сами
        let grandUltraFatherItemId: string = 'root'

        // Функция, принимающая id текущего элемента и меняющая статус отца
        function reselectParent(currentItemId: string) {

            // Флаг о том, нужно ли перепроверять select отца
            let parentSelectionChanged = false

            // Находим id родительского item для текущего item
            let parentItemId: any // = tableSelectionChildIdsByParentIdValue

            // Ищем отца для текущего item среди всех отцов
            for (const parentId in tableSelectionChildIdsByParentIdValue) {
                if (tableSelectionChildIdsByParentIdValue[parentId]?.includes(currentItemId)) {
                    // id отца для текущего item
                    parentItemId = parentId
                    // Так как перебираем в рекурсии, то сюда запишется самый старый предок
                    // Если мы обрабатываем самый первый уровень, то вместо root запишем любой 
                    // item 1 уровня, и это перерендерит тапблицу 1 уровня
                    if (parentId !== 'root') {
                        grandUltraFatherItemId = parentId
                    }
                    else {
                        grandUltraFatherItemId = currentItemId
                    }
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
                    tablesVotingResults?.length > 0
                    && !tablesVotingResults.includes("indeterminated")
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
                    tablesVotingResults?.length > 0
                    && !tablesVotingResults.includes("indeterminated")
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

            if (parentItemId !== 'root') {

                // Флаг о том, нужно ли перепроверять select детей
                let childSelectionChanged = false

                // Получаем id детей
                const childItemsIds = tableSelectionChildIdsByParentIdValue[parentItemId]

                // Если батя indeterminated, то проверяем
                // так ли это по статусам детей, иначе сделаем его selected или notSelected
                if (tableSelectionScopeValue[parentItemId] === "indeterminated") {

                    let tablesVotingResults: ("selected" | "notSelected" | "indeterminated" | undefined)[] = []
                    // Получаем голоса братьев
                    childItemsIds?.forEach(brotherItemId => {
                        // Записываем в массив голоса всех братьев
                        tablesVotingResults.push(tableSelectionScopeValue[brotherItemId])
                    })

                    // Если среди голосов все selected, то и отец selected
                    if (
                        tablesVotingResults?.length > 0
                        && !tablesVotingResults.includes("indeterminated")
                        && !tablesVotingResults.includes("notSelected")
                    ) {
                        if (tableSelectionScopeValue[parentItemId] !== "selected" && parentItemId !== 'root') {
                            tableSelectionScopeValue[parentItemId] = "selected"
                            // Передаем его своим детям
                            childSelectionChanged = true
                        }
                    }
                    // Если среди голосов все notSelected, то и отец notSelected
                    else if (
                        tablesVotingResults?.length > 0
                        && !tablesVotingResults.includes("indeterminated")
                        && !tablesVotingResults.includes("selected")
                    ) {
                        if (tableSelectionScopeValue[parentItemId] !== "notSelected" && parentItemId !== 'root') {
                            tableSelectionScopeValue[parentItemId] = "notSelected"
                            // Передаем его своим детям
                            childSelectionChanged = true
                        }
                    }
                    // а если есть и selected, и notSelected, то отец действительно indeterminated
                    // и не нужно дальше обновлять статусы детей
                    // --------------
                }
                // А если статус отца не равен indeterminated, то сразк передаем его детям
                else {
                    // Передаем его своим детям
                    childSelectionChanged = true
                }

                if (childSelectionChanged === true) {
                    // Так как мы обрабатываем нажатый item, то удаляем его из массив indeterminated
                    tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'] = tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList']?.filter(fItemId => fItemId !== parentItemId)

                    childItemsIds?.forEach(iChildItemId => {
                        // Наследуем статус родительского item
                        // console.log("Статус бати", tableSelectionScopeValue[parentItemId])
                        tableSelectionScopeValue[iChildItemId] = tableSelectionScopeValue[parentItemId]

                        // Передаем его своим детям
                        reselectChild(iChildItemId)
                    })
                }
            }
        }

        // console.log("tableSelectionClickItemIdValue в функции", [...selectionScopeStore.get(tableSelectionClickItemIdAtom)])

        // console.log("ROOOOOTTTT в конце вункциииии")
        // console.log("tableSelectionScopeValue", tableSelectionScopeValue)
        // console.log("tableSelectionChildIdsByParentIdValue", tableSelectionChildIdsByParentIdValue)
        // console.log("tableSelectionClickItemIdValue", tableSelectionClickItemIdValue)
        // console.log("tableSelectionByDBClassValue", tableSelectionByDBClassValue)
        // console.log("tableSelectionScopeInternalValue", tableSelectionScopeInternalValue)
        // console.log("tableHandlerAtomValue", tableHandlerAtomValue)

        // Обрабатываем родителей и детей каждого нажатого item
        tableSelectionClickItemIdValue?.forEach(clickedItemId => {
            reselectParent(clickedItemId)
            reselectChild(clickedItemId)
            // console.log(`Обрабатываем ${clickedItemId} для родителей и детей`)
            // Возвращаем самого отца в массив indeterminated, так как он в таком виде может быть подан извне
            if (
                tableSelectionScopeValue[clickedItemId] === "indeterminated"
                && !tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].includes(clickedItemId)
            ) {
                tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].push(clickedItemId)
            }
        })

        // После того, как мы обработали все изменения, очищаем массив с id на изменения
        if (tableSelectionClickItemIdValue?.length > 0) {
            setTableSelectionClickItemIdValue([])
        }

        // console.log("ROOOOOTTTT в конце вункциииии ловим HANDLER")
        // console.log("grandUltraFatherItemId", grandUltraFatherItemId)
        // console.log("tableSelectionScopeInternalValue['tableIdByItemId']", tableSelectionScopeInternalValue['tableIdByItemId'])
        // console.log("tableSelectionScopeInternalValue['tableIdByItemId'][grandUltraFatherItemId]", tableSelectionScopeInternalValue['tableIdByItemId'][grandUltraFatherItemId])
        // console.log("tableHandlerAtomValue[tableSelectionScopeInternalValue['tableIdByItemId'][grandUltraFatherItemId]]", tableHandlerAtomValue[tableSelectionScopeInternalValue['tableIdByItemId'][grandUltraFatherItemId]])

        // Перерендеривае самого старшего отца, который сменил статус
        if (tableHandlerAtomValue[tableSelectionScopeInternalValue['tableIdByItemId'][grandUltraFatherItemId]]) {
            tableHandlerAtomValue[tableSelectionScopeInternalValue['tableIdByItemId'][grandUltraFatherItemId]]()
        }

        // console.log("tableSelectionClickItemIdValue в конце функции", [...selectionScopeStore.get(tableSelectionClickItemIdAtom)])
        // console.log("grandUltraFatherItemId в конце функции", grandUltraFatherItemId)
    }

    // Обрабатываем селекты
    refresScopeSelection()

    // Обработка scope принятого извне     
    // Перебираем полученный объект, и наполняем полученными данными scope || // Перебираем полученный объект, заменяя имеющиеся статусы, если они не равны
    // Если статус indeterminated, и id записи ещё нет в списке indeterminated, то добавляем
    // Вносим записи 1 уровня в массив на обновление, как будто нажали на каждый из них
    // Вызываем функцию обновления статусов всей иерархии, чтобы дети наслевовали статусы
    useEffect(() => {
        // Обработаем статусы извне
        if (
            props.newSelectionScope?.itemsSelection !== undefined
            // && Object.keys(tableSelectionScopeValue)?.length > 0
        ) {
            // console.log("tableSelectionClickItemIdValue в НАЧАЛЕ", [...tableSelectionClickItemIdValue])
            // Меняем статусы на полученные
            for (const itemId in props.newSelectionScope.itemsSelection) {
                tableSelectionScopeValue[itemId] = props.newSelectionScope.itemsSelection[itemId]

                // Если parentTableItemId ещё нет в массиве indeterminated, то добавляем
                if (
                    tableSelectionScopeValue[itemId] === "indeterminated"
                    && !tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].includes(itemId)
                ) {
                    tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].push(itemId)
                }
            }
        }
        // Обработаем словарь связей извне
        if (
            props.newSelectionScope?.refWithParent !== undefined
            // && Object.keys(tableSelectionScopeValue)?.length > 0
        ) {
            // console.log("tableSelectionClickItemIdValue в НАЧАЛЕ", [...tableSelectionClickItemIdValue])
            // Меняем статусы на полученные
            for (const parentItemId in props.newSelectionScope.refWithParent) {
                // Добавим id детей к имеющимся
                props.newSelectionScope.refWithParent[parentItemId]?.forEach((iChildItemId: (string)) => {
                    if (
                        typeof iChildItemId === 'string'
                        && !tableSelectionChildIdsByParentIdValue[parentItemId]?.includes(iChildItemId)
                    ) {
                        if (
                            Array.isArray(tableSelectionChildIdsByParentIdValue[parentItemId])
                        ) {
                            tableSelectionChildIdsByParentIdValue[parentItemId].push(iChildItemId)
                        }
                        else {
                            tableSelectionChildIdsByParentIdValue[parentItemId] = [iChildItemId]
                        }

                    }
                })
                

                // Если parentTableItemId ещё нет в массиве indeterminated, то добавляем
                if (
                    tableSelectionScopeValue[parentItemId] === "indeterminated"
                    && !tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].includes(parentItemId)
                ) {
                    tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].push(parentItemId)
                }
            }
        }
        // Обновим атомы
        if (
            props.newSelectionScope?.itemsSelection !== undefined
            && props.newSelectionScope?.refWithParent !== undefined
        ) {
            if (tableSelectionChildIdsByParentIdValue['root']) {
                setTableSelectionClickItemIdValue(tableSelectionChildIdsByParentIdValue['root'])
                // Если после внесенных изменений в атом вызвать функцию, то данные не обновялся, так как нужно
                // заново получить списов нажатых items
                // refresScopeSelection()
            }

            // sendOutput(props.noodlNode, 'selectionScope', tableSelectionScopeValue)
            // Сохраняем внесенные изменения
            setTableSelectionScopeValue(tableSelectionScopeValue)
            setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)

            // console.log("tableSelectionClickItemIdValue в КОНЦЕ", [...selectionScopeStore.get(tableSelectionClickItemIdAtom)])
            // Перерендериваем компоненту, чтобы она получила обновленные значения атомов

            forceUpdateSelectionScope()
        }
    }, [
        props.newSelectionScope,
    ])

    useEffect(() => {
        return () => {
            // При размонтировании очищаем scope
            tableSelectionScopeInternalValue['allTableIdList'] = []
            tableSelectionScopeInternalValue['tableIdByItemId'] = {}
            tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'] = []


            setTableSelectionScopeValue({})
            setTableSelectionChildIdsByParentIdValue({})
            setTableSelectionClickItemIdValue([])
            setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)
            setTableHandlerAtomValue({})
        } 
    },[])

    // Сохраняем изменения в атомах
    delete tableSelectionScopeValue['root']
    setTableSelectionScopeValue(tableSelectionScopeValue)
    setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)

    // Подаем на выходы данные
    // Чтобы не было мутация атома, подаем через {...obj}
    sendOutput(props.noodlNode, 'selectionScope', { ...tableSelectionScopeValue })
    sendOutput(props.noodlNode, 'selectionByDBClass', { ...tableSelectionByDBClassValue })
    sendSignal(props.noodlNode, 'changed')

    // При внешнем триггере reset очищаем молекулу
    useImperativeHandle(ref, () => ({

        reset() {
            // resetScope()
            // console.log("REF CHILD TRIGGERED")

            // Сбросим селекты у всех записей
            for (const itemId in tableSelectionScopeValue) {
                tableSelectionScopeValue[itemId] = "notSelected"
            }

            // Очистим массив indeterminated
            tableSelectionScopeInternalValue["tableIndeterminatedItemsIdList"] = []

            // tableSelectionScopeValue['root'] = 'notSelected'

            // setTableSelectionClickItemIdValue(['root'])

            // sendOutput(props.noodlNode, 'selectionScope', { ...tableSelectionScopeValue })
            // sendOutput(props.noodlNode, 'selectionByDBClass', { ...tableSelectionByDBClassValue })
            // sendSignal(props.noodlNode, 'changed')

            setTableSelectionScopeValue(tableSelectionScopeValue)
            setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)

            if (tableHandlerAtomValue[tableSelectionScopeInternalValue['allTableIdList'][0]] !== undefined) {
                tableHandlerAtomValue[tableSelectionScopeInternalValue['allTableIdList'][0]]()
            }
            forceUpdateSelectionScope()
        }
    }), [])

    return <>{props.children}</>
})


// Что за forwardRef и как он работатет
export default forwardRef(function (props: Props, ref) {

    // console.log("props", props)
    // console.log("========================================================================")
    // console.log("========================================================================")
    // console.log("========================================================================")
    // console.log("ID КОМПОНЕНТЫ", props?.noodlNode?.id)
    
    const scopeId = props?.noodlNode?.id
    
    const [selectionScopeStoreValue, setSelectionScopeStoreValue] = useAtom(selectionScopeStoreAtom)
    // console.log("selectionScopeStoreValue[scopeId]", selectionScopeStoreValue[scopeId])

    // Создаем/получаем store
    // Передаем его дочерним нодам и используем, для получения значений из atom
    if (selectionScopeStoreValue[scopeId] === undefined) {
        selectionScopeStoreValue[scopeId] = createStore()
        selectionScopeStoreValue[scopeId].set(tableSelectionScopeAtom, {})
        selectionScopeStoreValue[scopeId].set(tableSelectionChildIdsByParentIdAtom, { 'root': [] })
        selectionScopeStoreValue[scopeId].set(tableSelectionClickItemIdAtom, [])
        selectionScopeStoreValue[scopeId].set(tableselectionByDBClassAtom, {})
        selectionScopeStoreValue[scopeId].set(tableSelectionScopeInternalAtom, {
            'tableIdByItemId': {},                          // Словарь, где ключи - id записей, а значения - id таблиц
            'tableIndeterminatedItemsIdList': [],           // Массив с id запсией, которые должны быть indeterminated
            'allTableIdList': [],                           // Массив всех tableId для отладки, так как в объекте они встают по алфовиту
        })
        selectionScopeStoreValue[scopeId].set(tableHandlerAtom, {})
        setSelectionScopeStoreValue(selectionScopeStoreValue)
    }
    console.log("selectionScopeStoreValue[scopeId]", selectionScopeStoreValue[scopeId])
    // else {
    //     selectionScopeStoreValue[scopeId] = useStore()
    // }

    // console.log("РЕНДЕРИТСЯ БАТЯ SCOPE")
    // console.log("tableSelectionScopeValue", selectionScopeStoreValue[scopeId].get(tableSelectionScopeAtom))
    // console.log("tableSelectionChildIdsByParentIdValue", selectionScopeStoreValue[scopeId].get(tableSelectionChildIdsByParentIdAtom))
    // console.log("tableSelectionClickItemIdValue", selectionScopeStoreValue[scopeId].get(tableSelectionClickItemIdAtom))
    // console.log("tableSelectionScopeInternalValue", selectionScopeStoreValue[scopeId].get(tableSelectionScopeInternalAtom))
    // console.log("tableHandlerAtomValue", selectionScopeStoreValue[scopeId].get(tableHandlerAtom))


    // При внешнем триггере reset очищаем молекулу
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        reset() {
            // console.log("REF PARENT TRIGGERED")
            localRef.current?.reset()
        },
    }), [])

    return <JotaiProvider store={selectionScopeStoreValue[scopeId]}>
        <HandlerTableSelectionScope
            ref={localRef}
            {...props}
        />
    </JotaiProvider>

})



// // Что за forwardRef и как он работатет
// export default forwardRef(function (props: Props, ref) {

//     console.log("props", props)
//     console.log("ID КОМПОНЕНТЫ", props?.noodlNode?.id)

//     const scopeId = props?.noodlNode?.id

//     // Проверяем, есть ли уже store
//     if (useStore().get(tableSelectionScopeAtom)) {

//         const selectionScopeStore = { [scopeId]: useStore() }

//         // При внешнем триггере reset очищаем молекулу
//         const localRef = useRef<any>(null)
//         useImperativeHandle(ref, () => ({
//             reset() {
//                 console.log("REF PARENT TRIGGERED")
//                 localRef.current?.reset()
//             },
//         }), [])

//         return <JotaiProvider store={selectionScopeStore[scopeId]}>
//             <HandlerTableSelectionScope
//                 ref={localRef}
//                 {...props}
//             />
//         </JotaiProvider>
//     }
//     else {

//         // Создаем/получаем store
//         // Передаем его дочерним нодам и используем, для получения значений из atom
//         const selectionScopeStore = { [scopeId]: createStore()}

//         // Инициализируем атомы - загружаем атомы в store
//         // if (selectionScopeStore.get(tableSelectionScopeAtom) === undefined) {
//         selectionScopeStore[scopeId].set(tableSelectionScopeAtom, {})
//         selectionScopeStore[scopeId].set(tableSelectionChildIdsByParentIdAtom, { 'root': [] })
//         selectionScopeStore[scopeId].set(tableSelectionClickItemIdAtom, [])
//         selectionScopeStore[scopeId].set(tableselectionByDBClassAtom, {})
//         selectionScopeStore[scopeId].set(tableSelectionScopeInternalAtom, {
//             'tableIdByItemId': {},                          // Словарь, где ключи - id записей, а значения - id таблиц
//             'tableIndeterminatedItemsIdList': [],           // Массив с id запсией, которые должны быть indeterminated
//             'allTableIdList': [],                           // Массив всех tableId для отладки, так как в объекте они встают по алфовиту
//         })
//         selectionScopeStore[scopeId].set(tableHandlerAtom, {})
//         // }

//         // console.log("РЕНДЕРИТСЯ БАТЯ SCOPE")
//         // console.log("tableSelectionScopeValue", selectionScopeStore.get(tableSelectionScopeAtom))
//         // console.log("tableSelectionChildIdsByParentIdValue", selectionScopeStore.get(tableSelectionChildIdsByParentIdAtom))
//         // console.log("tableSelectionClickItemIdValue", selectionScopeStore.get(tableSelectionClickItemIdAtom))
//         // console.log("tableSelectionScopeInternalValue", selectionScopeStore.get(tableSelectionScopeInternalAtom))
//         // console.log("tableHandlerAtomValue", selectionScopeStore.get(tableHandlerAtom))


//         // При внешнем триггере reset очищаем молекулу
//         const localRef = useRef<any>(null)
//         useImperativeHandle(ref, () => ({
//             reset() {
//                 console.log("REF PARENT TRIGGERED")
//                 localRef.current?.reset()
//             },
//         }), [])

//         return <JotaiProvider store={selectionScopeStore[scopeId]}>
//             <HandlerTableSelectionScope
//                 ref={localRef}
//                 {...props}
//             />
//         </JotaiProvider>
//     }

// })
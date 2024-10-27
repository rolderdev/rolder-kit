/* Управляющая компонента. Управляет поведением дочерней TableInstance.
Отличие Table от всех других комонент RK в том, что здесь мы пытаемся свести к минимуму рендеры.

Поскольку рендер прилетает от родительской компоненты, нужно остановить его для точечного управления реактивностью.
Делается это выводом управления реактивностью за пределы React вообще - https://tkdodo.eu/blog/the-uphill-battle-of-memoization.
Здесь с помощью библиотеки MobX. MobX позволяет делать это прямо в компоненте с помощью useLocalObservable, что избавляет нас 
от использования deepMap nanostores с установкой tableId. В MobX так же ощутимо легче организовать точечную реактивность.

Для дебага реактивности используется простой лог в Table - "Table run", отражающий вычесления и в TableInstance - "Table render",
означающий новый рендер таблицы. При загрузке таблицы должно быть 2 рендера. 1 рендер добавляет опция Animation. 
Количество рендеров не меняется от того родительская это таблица или дочерняя.
*/

import { useShallowEffect } from '@mantine/hooks'
import { getCompProps } from '@packages/get-comp-props'
import { configure } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import TableInstance from './src/TableInstance'
import { getLibProps } from './src/models/libPropsModel'
import { store } from './src/models/storeModel'
import { getTableProps } from './src/models/tablePropsModel'
import type { Props } from './types'

// Так MobX не будет шарить состояние между соседними таблицами. https://mobx.js.org/configuration.html#further-configuration-options
configure({ isolateGlobalState: true })

// Стили загружаем здесь, просто кажется логичным делать это до загрузки TableInstance
import '@mantine/core/styles/Table.css'
import 'mantine-datatable/styles.css'

// observer создает HoC-компоненту, позволяя точечно управлять реактивностю.
export default observer(
	forwardRef((props: Props, ref) => {
		// Даем разработчику извращаться, если он смелый.
		const p: Props = getCompProps(props)

		// Первичное состояние, инициализируется только при первом рендере.
		const storeInstance = useLocalObservable(() => {
			return store.create({
				noodlNode: props.noodlNode,
				tableId: nanoid(8),
				// Сгруппируем настройки для удобства.
				libProps: getLibProps(p),
				tableProps: getTableProps(p),
			})
		})

		// Реактивность на изменение настроек библиотеки и наших дополнительных настроек.
		useEffect(() => storeInstance.setProps(p), [p])

		// Реактинвость на изменение колонок и items.
		useShallowEffect(() => {
			setTimeout(() => {
				if (p.columnsDefinition && p.items) {
					console.log('>>> setState <<<')
					storeInstance.setTableState(p.columnsDefinition, p.items)
				}
				// Нужен timeout, чтобы успела отрендерится анимация загрузки.
				// Когда таблица маленькая, достаточно одного тика, при большоим объеме разработчик должен сам подобрать значение.
				// Не удается это автоматизировать, т.к. не известно насколько тяжелые ячейки в таблице.
			}, storeInstance.tableProps.renderDelay)
		}, [p.columnsDefinition, p.items])

		// Внешние сигналы
		useImperativeHandle(
			ref,
			() => ({
				/* table2ResetSingleSelection() { setSelectedRecord(tableId, undefined) },
            table2ResetMultiSelection() { setSelectedRecords(tableId, []) },
            table2ResetSort() { setSortStatus(undefined) },
            table2ResetFilters() { resetFilters(); forceUpdate() }, */
				expandAll() {
					storeInstance.setExpandedRows(p.items?.map((i) => i.id) || [])
				},
				unexpandAll() {
					storeInstance.setExpandedRows([])
				},
			}),
			[storeInstance]
		)

		//console.log('Table run', storeInstance.tableId);
		return <TableInstance store={storeInstance} />
	})
)

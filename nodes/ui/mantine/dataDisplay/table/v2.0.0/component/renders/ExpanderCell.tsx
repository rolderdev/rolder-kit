import { ActionIcon, Box, Group } from '@mantine/core'
import clsx from 'clsx'
import { memo, useContext } from 'react'
import { TableContext } from '../TableProvider'
import useItem from '../funcs/useItem'
import useNode from '../funcs/useNode'
import { expansionFiltered, toggleRowExpansion } from '../models/expansion'
import Cell from './Cell'

import classes from '../styles/expansionCell.module.css'

export default memo((p: { columnIdx: string; id: string }) => {
	const { useSnapshot } = R.libs.valtio

	const store = useContext(TableContext)
	const snap = useSnapshot(store)

	const onRowClick = store.tableProps.onRowClick
	const ChevronIcon = R.libs.icons.IconChevronRight

	const itemSnap = useItem(p.id, 'snap')

	// Вытягиваем реактивное состояние развернутости для анимации шеврона.
	const expanded = snap.expandedIds[p.id]

	// Определим, исключена ли строка из развертывния разработчиком.
	const disabled = expansionFiltered(store, p.id)

	// Реактивность на изменение ноды.
	const nodeStore = useNode(store, p.id, 'store')
	const nodeSub = useNode(store, p.id, 'sub')
	if (nodeStore && nodeSub) {
		// Не большая хитрость. Мы не можем доверять детям, т.к. там могут быть дети не участвующие в иерархии таблиц.
		// Но нам нужно подписаться на изменение их количества. nodeSub.childIds - так нельзя, тригерит все ячейки.
		nodeSub.childIds.length
		// Свернем строку, если она отфильтрована разработчиком.
		if (expansionFiltered(store, p.id)) {
			// Именно в этом порядке. Иначе ошибка 300 React.
			nodeStore.states.expansion.value = false
			store.expandedIds[p.id] = false
			// Установим новое состояние, если оно изменилось в иерархии и если не отфильтровано разработчиком.
		} else store.expandedIds[p.id] = nodeSub.states.expansion.value
		// Добавим состояне для чекбокса.
		store.checkboxes.hasChildren[p.id] = store.expandedIds[p.id]
	}

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion
	const level = store.hierarchy.level
	const pl = itemSnap && store.tableProps.paddingLeftFunc?.(level, itemSnap)

	//console.log('Expander render', level);
	if (onRowClick === 'expansion')
		return (
			<Group pl={paddingLeftPostion === 'expander' ? pl : undefined} wrap="nowrap" gap={6}>
				<Box mt={1} ml={1} my={-1} mr={-1}>
					<ChevronIcon
						color={disabled ? '#adb5bd' : '#2e2e2e'}
						className={clsx(classes.icon, classes.expandIcon, {
							[classes.expandIconRotated]: expanded,
						})}
					/>
				</Box>
				<Cell columnIdx={p.columnIdx} id={p.id} />
			</Group>
		)
	else
		return (
			<Group pl={paddingLeftPostion === 'expander' ? pl : undefined} wrap="nowrap" gap={6}>
				<ActionIcon
					variant="subtle"
					color="dark"
					my={-3.5}
					ml={-5.5}
					mr={3.5}
					onClick={(e) => {
						e.stopPropagation()
						toggleRowExpansion(store, p.id)
					}}
					disabled={disabled}
					style={{ background: disabled ? 'transparent' : undefined }}
				>
					<ChevronIcon
						className={clsx(classes.actionIcon, classes.expandIcon, {
							[classes.expandIconRotated]: expanded,
						})}
					/>
				</ActionIcon>
				<Cell columnIdx={p.columnIdx} id={p.id} />
			</Group>
		)
})

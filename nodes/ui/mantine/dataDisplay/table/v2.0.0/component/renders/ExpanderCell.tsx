import { ActionIcon, Box, Group } from '@mantine/core'
import clsx from 'clsx'
import { memo, useEffect } from 'react'
import { expansionFiltered, toggleRowExpansion } from '../models/expansion'
import useNode from '../shared/useNode'
import { useStore } from '../store'
import Cell from './Cell'

import classes from '../styles/expansionCell.module.css'

export default memo((p: { tableId: string; id: string; columnId: string }) => {
	const { useSnapshot } = R.libs.valtio

	const s = useStore(p.tableId)
	const sn = useSnapshot(s)

	const onRowClick = s.tableProps.onRowClick
	const ChevronIcon = R.libs.icons.IconChevronRight

	// Вытягиваем реактивное состояние развернутости для анимации шеврона.
	const expanded = sn.expandedIds[p.id]

	// Определим, исключена ли строка из развертывния разработчиком.
	const disabled = expansionFiltered(s, p.id, sn.funcs.expansionFilterFunc)

	// Реактивность на изменение ноды.

	const nodeSub = useNode(s, p.id, 'sub')

	useEffect(() => {
		if (nodeSub) {
			// Свернем строку, если она отфильтрована разработчиком.
			if (expansionFiltered(s, p.id, sn.funcs.expansionFilterFunc)) {
				const nodeStore = useNode(s, p.id, 'store')
				// Именно в этом порядке. Иначе ошибка 300 React.
				if (nodeStore) nodeStore.states.expansion.value = false
				s.expandedIds[p.id] = false
				// Установим новое состояние, если оно изменилось в иерархии и если не отфильтровано разработчиком.
			} else s.expandedIds[p.id] = nodeSub.states.expansion.value
			s.expandedIdsArr = Object.keys(s.expandedIds).filter((id) => s.expandedIds[id])
		}
	}, [s, nodeSub, p.id, sn.funcs.expansionFilterFunc])

	//console.log('Expander render', paddingLeftPostion, pl)
	if (onRowClick === 'expansion')
		return (
			<Group
				pl={s.tableProps.rowStyles.paddingLeftPostion === 'expander' ? s.rows[p.id].props?.pl : undefined}
				wrap="nowrap"
				gap={6}
			>
				<Box mt={1} ml={1} my={-1} mr={-1}>
					<ChevronIcon
						color={disabled ? '#adb5bd' : '#2e2e2e'}
						className={clsx(classes.icon, classes.expandIcon, {
							[classes.expandIconRotated]: expanded,
						})}
					/>
				</Box>
				<Cell tableId={p.tableId} columnId={p.columnId} id={p.id} isFirst={true} />
			</Group>
		)

	return (
		<Group
			pl={s.tableProps.rowStyles.paddingLeftPostion === 'expander' ? s.rows[p.id].props?.pl : undefined}
			wrap="nowrap"
			gap={6}
		>
			<ActionIcon
				variant="subtle"
				color="dark"
				my={-3.5}
				ml={-5.5}
				mr={3.5}
				onClick={(e) => {
					e.stopPropagation()
					toggleRowExpansion(s, p.id)
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
			<Cell tableId={p.tableId} columnId={p.columnId} id={p.id} isFirst={true} />
		</Group>
	)
})

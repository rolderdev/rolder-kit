/* Функция добавляет шеврон к ячейке.
Шеврон - иконка, если onRowClick = expansion, actionIcon, если onRowClick !== expansion. */

import { ActionIcon } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import type { Record } from '../models/recordModel'
import type { TableProps } from '../models/tablePropsModel'

import classes from '../styles/expansionCell.module.css'

export default observer((p: { cell: React.ReactNode; onRowClick: TableProps['onRowClick']; record: Record }) => {
	const { cell, onRowClick, record } = p

	if (onRowClick === 'expansion')
		return (
			<>
				<IconChevronRight
					className={clsx(classes.icon, classes.expandIcon, {
						[classes.expandIconRotated]: record.expanded,
					})}
				/>
				{cell}
			</>
		)
	else
		return (
			<>
				<ActionIcon onClick={() => record.setExpanded(!record.expanded)}>
					<IconChevronRight
						className={clsx(classes.icon, classes.expandIcon, {
							[classes.expandIconRotated]: record.expanded,
						})}
					/>
				</ActionIcon>
				{cell}
			</>
		)
})

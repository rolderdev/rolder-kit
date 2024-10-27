/* Функция добавляет шеврон к ячейке.
Шеврон - иконка, если onRowClick = expansion, actionIcon, если onRowClick !== expansion
Сюда должна прилетать готовая ячейка - React-нода.
Здесь используется nanoatom, чтобы сделать реактивность на состояние разворачивания только в ячейках с шефроном.
А так же useMemo, чтобы не рендерить ячеки почем зря.
*/

//import { useStore } from "@nanostores/react";
import { ActionIcon } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import clsx from 'clsx'
import { useMemo } from 'react'
import type { Item } from 'types'
import type { TableProps } from '../../types'
//import { expendedRowsIdsAtom } from "../funcs/expansionRows";

import classes from '../styles/expansionCell.module.css'

export default function (tableId: string, onRowClick: TableProps['onRowClick'], record: Item, cell: React.ReactNode) {
	//const expendedRowsIds = useStore(expendedRowsIdsAtom(tableId))

	return useMemo(
		() =>
			onRowClick === 'expansion' ? (
				<>
					<IconChevronRight
						className={clsx(classes.icon, classes.expandIcon, {
							[classes.expandIconRotated]: true, //expendedRowsIds.includes(record.id),
						})}
					/>
					<span>{cell}</span>
				</>
			) : (
				<>
					<ActionIcon>
						<IconChevronRight
							className={clsx(classes.icon, classes.expandIcon, {
								[classes.expandIconRotated]: true, // expendedRowsIds.includes(record.id),
							})}
						/>
					</ActionIcon>
					<span>{cell}</span>
				</>
			),
		['expendedRowsIds']
	)
}

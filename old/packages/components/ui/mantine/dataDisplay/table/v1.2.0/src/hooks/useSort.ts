import { useShallowEffect } from '@mantine/hooks'
import type { NoodlNode } from '@packages/node'
import { sendOutput } from '@packages/port-send'
import { useState } from 'react'
import type { ColumnDef, TableProps } from '../../types'
import type { DataTableSortStatus } from '../lib'

export default function (noodlNode: NoodlNode, sort: TableProps['sort'], columns: ColumnDef[]) {
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>()

	useShallowEffect(() => {
		if (sort.enabled) {
			const defaultSortColumn = columns?.find((i) => i.sort?.default)
			if (!sortStatus && defaultSortColumn && defaultSortColumn.sort)
				setSortStatus({
					columnAccessor: defaultSortColumn.accessor,
					direction: defaultSortColumn.sort.default,
				})
		}
		if (sortStatus) {
			sendOutput(noodlNode, 'table2SortValue', [{ [sortStatus.columnAccessor]: sortStatus.direction }])
		} else sendOutput(noodlNode, 'table2SortValue', null)
	}, [sortStatus])

	return { sortStatus, setSortStatus }
}

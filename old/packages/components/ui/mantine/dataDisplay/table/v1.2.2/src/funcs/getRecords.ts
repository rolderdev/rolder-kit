import type { Item } from 'types'
import type { ColumnDef, TableProps } from '../../types'
import type { DataTableSortStatus } from '../lib'

export default (
	filter: TableProps['filter'],
	columns: ColumnDef[],
	items: Item[],
	getColumnFilter: any,
	runFilterFunc: any,
	fetching?: boolean,
	sortStatus?: DataTableSortStatus
): Item[] => {
	let resultRecords = [...(items || [])]

	// Front filter
	if (filter.enabled && filter.type === 'frontend')
		columns?.forEach((_, columnIdx) => {
			const filterValue = getColumnFilter(columnIdx)?.value
			if (runFilterFunc && filterValue) resultRecords = runFilterFunc(columnIdx, items, getColumnFilter(columnIdx)?.value)
		})

	// Front sort
	if (sortStatus?.direction && !fetching) {
		const sortFunc = columns.find((i) => i.accessor === sortStatus?.columnAccessor)?.sort?.func
		if (sortFunc) resultRecords = sortFunc(resultRecords, sortStatus.direction)
	}

	return resultRecords
}

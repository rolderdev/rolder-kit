import type { CheckboxProps } from '@mantine/core'
import type { FilterState } from '@nodes/table-filter-v0.1.0'
import type Node from '@nodes/use-data-v2.0.0/component/Node'
import type { NoodlNode } from '@shared/node-v1.0.0'
import type { DataTableSortStatus } from 'mantine-datatable'
import type { ColumnsDefinition } from './models/column'
import type { LibProps } from './models/libProps'
import type { TableRecord } from './models/record'
import type { TableProps } from './models/tableProps'

export default (noodlNode: NoodlNode) => {
	const { proxy, ref } = R.libs.valtio

	return proxy<Store>({
		noodlNode: ref(noodlNode),
		inited: false,
		hierarchy: { isChild: false, level: 0 },
		fetching: true,
		libProps: {} as LibProps,
		tableProps: {} as TableProps,
		columnsDefinition: {},
		records: [],
		originalIds: [],
		selectedId: null,
		selectedIds: {},
		checkboxes: { unsubs: {}, props: {}, hasChildren: {} },
		expandedIds: {},
		sort: {},
		filters: {},
	})
}

export type Store = {
	noodlNode: NoodlNode
	inited: boolean
	hierarchy: {
		isChild: boolean
		level: number
		tableNodePath?: string
		tableNode?: Node
	}
	fetching: boolean
	libProps: LibProps
	tableProps: TableProps
	columnsDefinition: ColumnsDefinition
	records: TableRecord[]
	originalIds: string[]
	selectedId: string | null
	selectedIds: Record<string, boolean>
	checkboxes: {
		unsubs: { [id: string]: () => void }
		props: { [id: string]: CheckboxProps }
		hasChildren: { [id: string]: boolean }
	}
	expandedIds: Record<string, boolean>
	sort: { state?: DataTableSortStatus<TableRecord>; unsub?: () => void }
	filters: { state?: Record<string, FilterState>; unsub?: () => void }
}

export type Snap = Readonly<Store>

import type { NoodlNode } from '@shared/node-v1.0.0';
import type { ColumnsDefinition } from '../component/models/column';
import type { TableRecord } from '../component/models/record';
import type { LibProps } from '../component/models/libProps';
import type { TableProps } from '../component/models/tableProps';
import type { Props } from './definition';
import type Node from '@nodes/use-data-v2.0.0/component/Node';
import type { CheckboxProps } from '@mantine/core';
import type { DataTableSortStatus } from 'mantine-datatable';

export default (p: Props, noodlNode: NoodlNode) => {
	const { proxy, ref } = R.libs.valtio;

	return proxy<Store>({
		noodlNode: ref(noodlNode),
		inited: false,
		hierarchy: { isChild: false, level: 0 },
		fetching: true,
		libProps: {} as LibProps,
		tableProps: {} as TableProps,
		columnsDefinition: {},
		records: [],
		selectedId: null,
		selectedIds: {},
		checkboxes: { unsubs: {}, props: {}, hasChildren: {} },
		expandedIds: {},
		expanders: {},
	});
};

export type Store = {
	noodlNode: NoodlNode;
	inited: boolean;
	hierarchy: {
		isChild: boolean;
		level: number;
		tableNodePath?: string;
		tableNode?: Node;
	};
	fetching: boolean;
	libProps: LibProps;
	tableProps: TableProps;
	columnsDefinition: ColumnsDefinition;
	records: TableRecord[];
	selectedId: string | null;
	selectedIds: Record<string, boolean>;
	checkboxes: {
		unsubs: { [id: string]: () => void };
		props: { [id: string]: CheckboxProps };
		hasChildren: { [id: string]: boolean };
	};
	expandedIds: Record<string, boolean>;
	expanders: Record<string, boolean>;
	sortState?: DataTableSortStatus<TableRecord>;
};

export type Snap = Readonly<Store>;

import type { NoodlNode } from '@shared/node-v1.0.0';
import type { ColumnsDefinition } from '../component/models/columnModel';
import type { TableRecord } from '../component/models/recordModel';
import type { LibProps } from '../component/models/libPropsModel';
import type { TableProps } from '../component/models/tablePropsModel';
import type { Props } from '../types';

export default (p: Props) => {
	const { proxy, ref } = R.libs.valtio;
	return proxy<Store>({
		noodlNode: ref(p.noodlNode),
		tableId: '',
		inited: false,
		isChild: false,
		level: 0,
		fetching: true,
		libProps: {} as LibProps,
		tableProps: {} as TableProps,
		columnsDefinition: {} as ColumnsDefinition,
		records: [],
		selectedId: null,
		selectedIds: [],
		expandedIds: [],
		defaults: {
			selectedId: p.defaultSelectedItem?.id || null,
			selectedIds: p.defaultSelectedItems?.map((i) => i.id) || [],
			expandedIds: p.defaultExpandedItems?.map((i) => i.id) || [],
		},
	});
};

export type Store = {
	noodlNode: NoodlNode;
	tableId: string;
	inited: boolean;
	isChild: boolean;
	level: number;
	fetching: boolean;
	libProps: LibProps;
	tableProps: TableProps;
	columnsDefinition: ColumnsDefinition;
	records: TableRecord[];
	selectedId: string | null;
	selectedIds: string[];
	expandedIds: string[];
	defaults: { selectedId: string | null; selectedIds: string[]; expandedIds: string[] };
};

export type Snap = Readonly<Store>;

import type { NoodlNode } from '@shared/node-v1.0.0';
import type { FrontItem } from '@shared/types-v0.1.0';
import type { ColumnsDefinition } from '../component/models/columnModel';
import type { ForntItems, TableRecord } from '../component/models/itemModel';
import type { LibProps } from '../component/models/libPropsModel';
import type { TableProps } from '../component/models/tablePropsModel';
import type { Props } from '../types';
import type { HierarchyNode } from '@nodes/use-data-v2.0.0';

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
		items: {} as ForntItems,
		selectedItem: null,
		selectedRecords: [],
		expandedIds: [],
		defaults: {
			selectedItem: p.defaultSelectedItem || null,
			selectedItems: p.defaultSelectedItems || [],
			expandedItems: p.defaultExpandedItems || [],
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
	items: ForntItems;
	selectedItem: FrontItem | null;
	selectedRecords: TableRecord[];
	expandedIds: string[];
	hierarchyNode?: HierarchyNode;
	defaults: { selectedItem: FrontItem | null; selectedItems: FrontItem[]; expandedItems: FrontItem[] };
};

export type Snap = Readonly<Store>;

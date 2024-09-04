import type { NoodlNode } from '@shared/node-v1.0.0';
import type { ColumnsDefinition } from '../component/models/columnModel';
import type { TableRecord } from '../component/models/recordModel';
import type { LibProps } from '../component/models/libPropsModel';
import type { TableProps } from '../component/models/tablePropsModel';
import type { Props } from './definition';
import type Node from '@nodes/use-data-v2.0.0/component/Node';
import type { CheckboxProps } from '@mantine/core';

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
		defaults: {
			selectedId: p.defaultSelectedItem?.id || null,
			selectedIds: p.defaultSelectedItems?.map((i) => i.id) || [],
			expandedIds: p.defaultExpandedItems?.map((i) => i.id) || [],
		},
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
	defaults: { selectedId: string | null; selectedIds: string[]; expandedIds: string[] };
};

export type Snap = Readonly<Store>;

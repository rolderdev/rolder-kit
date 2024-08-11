import type { Item } from 'types';
import type { Store } from '../store/store';

export default function (s: Store, item: Item): string {
	const onRowClick = s.cold.tableProps.onRowClick.get();

	switch (onRowClick) {
		case 'signal': {
			const clickFilterFunc = s.cold.tableProps.clickFilterFunc?.get();
			if (clickFilterFunc && !clickFilterFunc(item)) return 'unset';
			return 'pointer';
		}
		case 'function': {
			const clickFilterFunc = s.cold.tableProps.clickFilterFunc?.get();
			if (clickFilterFunc && !clickFilterFunc(item)) return 'unset';
			return 'pointer';
		}
		case 'singleSelection': {
			const singleSelectionFilterFunc = s.cold.tableProps.singleSelectionFilterFunc?.get();
			if (singleSelectionFilterFunc && !singleSelectionFilterFunc(item)) return 'unset';
			return 'pointer';
		}
		case 'expansion': {
			const filterFunc = s.cold.tableProps.expansionFilterFunc?.get();
			if (filterFunc && !filterFunc(item)) return 'unset';
			return 'pointer';
		}
		default:
			return 'unset';
	}
}

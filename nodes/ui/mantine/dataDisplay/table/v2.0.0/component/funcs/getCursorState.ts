import type { Store } from '../../node/store';

export default function (s: Store, id: string): string {
	const snapshot = R.libs.valtio.snapshot;

	const onRowClick = s.tableProps.onRowClick;
	const item = R.items.get(id);

	if (item)
		switch (onRowClick) {
			case 'signal': {
				const clickFilterFunc = s.tableProps.clickFilterFunc;
				if (clickFilterFunc && !clickFilterFunc(snapshot(item))) return 'unset';
				return 'pointer';
			}
			case 'singleSelection': {
				const singleSelectionFilterFunc = s.tableProps.singleSelectionFilterFunc;
				if (singleSelectionFilterFunc && !singleSelectionFilterFunc(item)) return 'unset';
				return 'pointer';
			}
			case 'expansion': {
				const filterFunc = s.tableProps.expansion.filterFunc;
				if (filterFunc && !filterFunc(snapshot(item))) return 'unset';
				return 'pointer';
			}
			default:
				return 'unset';
		}
	return 'unset';
}

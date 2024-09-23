import type { Store } from '../store';
import useNode from './useNode';
import useItem from './useItem';

export default function (s: Store, id: string): string {
	const onRowClick = s.tableProps.onRowClick;
	const itemSnap = useItem(id, 'snap');
	const nodeSnap = useNode(s, id, 'snap');

	if (itemSnap)
		switch (onRowClick) {
			case 'signal': {
				const clickFilterFunc = s.tableProps.clickFilterFunc;
				if (clickFilterFunc && !clickFilterFunc(itemSnap, nodeSnap)) return 'unset';
				return 'pointer';
			}
			case 'singleSelection': {
				const singleSelectionFilterFunc = s.tableProps.singleSelectionFilterFunc;
				if (singleSelectionFilterFunc && !singleSelectionFilterFunc(itemSnap, nodeSnap)) return 'unset';
				return 'pointer';
			}
			case 'expansion': {
				const filterFunc = s.tableProps.expansion.filterFunc;
				if (filterFunc && !filterFunc(itemSnap, nodeSnap)) return 'unset';
				return 'pointer';
			}
			default:
				return 'unset';
		}
	return 'unset';
}

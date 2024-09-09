import type { Item } from '@shared/types-v0.1.0';

export default (id: string, type: 'snap' | 'sub' | 'store') => {
	const { useSnapshot, snapshot } = R.libs.valtio;

	const item = R.items[id];

	switch (type) {
		case 'snap':
			return item ? (snapshot(item) as Item) : undefined;
		case 'sub':
			return item ? (useSnapshot(item) as Item) : undefined;
		case 'store':
			return item;
	}
};

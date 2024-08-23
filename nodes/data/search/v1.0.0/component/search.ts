import Fuse from 'fuse.js';
import type { Item } from '@shared/types-v0.1.0';
import { sendOutput } from '@shared/port-send-v1.0.0';
import type { Props } from '../types';

export default {
	reactive: (p: Props) => {
		const { customOptions, items, fields, searchString, noodlNode } = p;
		if (items && searchString) {
			const fuse = new Fuse<Item>(items, { minMatchCharLength: 2, ...customOptions, keys: fields });
			const result = fuse.search(searchString);
			sendOutput(
				noodlNode,
				'items',
				result.map((i) => i.item)
			);
			sendOutput(noodlNode, 'count', result.length);
		}
	},
};

import type { JsComponent } from '@shared/node-v1.0.0'
import { sendOutput } from '@shared/port-send-v1.0.0'
import type { Item } from '@shared/types-v0.1.0'
import Fuse from 'fuse.js'
import type { Props } from '../node/definition'

export default {
	reactive: (p: Props, noodlNode) => {
		const { customOptions, items, fields, searchString } = p
		if (items && searchString) {
			const fuse = new Fuse<Item>(items, { minMatchCharLength: 2, ...customOptions, keys: fields })
			const result = fuse.search(searchString)
			sendOutput(
				noodlNode,
				'items',
				result.map((i) => i.item)
			)
			sendOutput(noodlNode, 'count', result.length)
		}
	},
} as JsComponent

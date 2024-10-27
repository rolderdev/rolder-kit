import { sendOutputs } from '@packages/port-send'
import Fuse from 'fuse.js'
import type { Item } from 'types'
import type { Props } from './types'

export default {
	reactive: (p: Props) => {
		const { customOptions, items, fields, searchString, noodlNode } = p
		if (items && searchString) {
			const fuse = new Fuse<Item>(items, { minMatchCharLength: 2, ...customOptions, keys: fields })
			const result = fuse.search(searchString)
			sendOutputs(noodlNode, [
				{ portName: 'items', value: result.map((i) => i.item) },
				{ portName: 'count', value: result.length },
			])
		}
	},
}

import type { BaseReactProps, ReactNodeDef } from '@shared/node-v1.0.0'
import { getPortDef, sizes } from '@shared/port-v1.0.0'
import type { Item } from '@shared/types-v0.1.0'

export type Props = BaseReactProps & { defaultValue?: string; valuePath: string; items?: Item[] }

import Comp from '../component/RadioGroup'

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({
				name: 'valuePath',
				displayName: 'Value path',
				group: 'Params',
				type: 'string',
				default: 'id',
				validate: (p: Props) => !!p.valuePath,
			}),
			getPortDef({ name: 'defaultValue', displayName: 'Default value', group: 'Params', type: 'string' }),
			getPortDef({ name: 'label', displayName: 'Label', group: 'Params', type: 'string' }),
			getPortDef({ name: 'description', displayName: 'Description', group: 'Params', type: 'string' }),
			getPortDef({ name: 'error', displayName: 'Error', group: 'Params', type: '*' }),
			getPortDef({
				name: 'items',
				displayName: 'Items',
				group: 'Data',
				type: 'array',
				validate: (p: Props) => !!p.items,
			}),
			getPortDef({ name: 'size', displayName: 'Size', group: 'Dimensions', type: sizes, default: 'sm' }),
			getPortDef({ name: 'withAsterisk', displayName: 'With asterisk', group: 'Styles', type: 'boolean', default: false }),
		],
		outputs: [
			getPortDef({ name: 'selectedValue', displayName: 'Selected value', group: 'Data', type: 'string' }),
			getPortDef({ name: 'selectedItem', displayName: 'Selected item', group: 'Data', type: 'object' }),
			getPortDef({ name: 'changed', displayName: 'Changed', group: 'Signals', type: 'signal' }),
		],
	},
} satisfies ReactNodeDef

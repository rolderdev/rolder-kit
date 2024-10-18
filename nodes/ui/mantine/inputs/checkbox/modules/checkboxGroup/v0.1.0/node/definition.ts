import type { BaseReactProps, ReactNodeDef } from '@shared/node-v1.0.0'
import { getPortDef, sizes } from '@shared/port-v1.0.0'
import type { Item } from '@shared/types-v0.1.0'

export type Props = BaseReactProps & { defaultValues?: string[]; valuePath: string; items?: Item[] }

import Comp from '../component/CheckboxGroup'

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
				validate: (p: Props) => (p.valuePath ? true : false),
			}),
			getPortDef({
				name: 'defaultValues',
				displayName: 'Default values',
				group: 'Params',
				type: 'array',
				validate: (p: Props) => {
					if (p.defaultValues && p.defaultValues.some((i) => typeof i !== 'string'))
						return `"Default values" must be array of string, got: ${JSON.stringify(p.defaultValues)}`
					return true
				},
			}),
			getPortDef({ name: 'label', displayName: 'Label', group: 'Params', type: 'string' }),
			getPortDef({ name: 'description', displayName: 'Description', group: 'Params', type: 'string' }),
			getPortDef({ name: 'error', displayName: 'Error', group: 'Params', type: '*' }),
			getPortDef({
				name: 'items',
				displayName: 'Items',
				group: 'Data',
				type: 'array',
				validate: (p: Props) => (p.items ? true : false),
			}),
			getPortDef({ name: 'size', displayName: 'Size', group: 'Dimensions', type: sizes, default: 'sm' }),
			getPortDef({ name: 'withAsterisk', displayName: 'With asterisk', group: 'Styles', type: 'boolean', default: false }),
		],
		outputs: [
			getPortDef({ name: 'selectedValues', displayName: 'Selected values', group: 'Data', type: 'array' }),
			getPortDef({ name: 'selectedItems', displayName: 'Selected item', group: 'Data', type: 'array' }),
			getPortDef({ name: 'changed', displayName: 'Changed', group: 'Signals', type: 'signal' }),
		],
	},
} satisfies ReactNodeDef

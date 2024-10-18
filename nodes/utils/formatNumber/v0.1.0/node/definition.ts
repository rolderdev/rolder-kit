import type { BaseJsProps } from '@shared/node-v1.0.0'
import type { JsNodeDef } from '@shared/node-v1.0.0'
import { getPortDef } from '@shared/port-v1.0.0'

import initState from '@shared/init-state-v0.1.0'

export type Props = BaseJsProps & {
	number?: number
	custom: boolean
	customFormat?: any
	mantissa?: number
	thousandSeparated?: boolean
	currency?: boolean
	spaceSeparated?: boolean
}

export default {
	hashTag: '#expreimental',
	module: { dynamic: import('../component/formatNumber') },
	inNode: {
		inputs: [
			getPortDef({ name: 'number', displayName: 'Number', group: 'Data', type: 'number' }),
			getPortDef({ name: 'custom', displayName: 'Custom', group: 'Params', type: 'boolean', default: false }),
			getPortDef({
				name: 'customFormat',
				displayName: 'Format',
				group: 'Params',
				type: 'objectEval',
				dependsOn: (p: Props) => p.custom,
				codeComment: `/*() => ({
	thousandSeparated: true,
	negative: 'parenthesis',
	mantissa: 4
})*/`,
			}),
			getPortDef({
				name: 'mantissa',
				displayName: 'Mantissa',
				group: 'Params',
				type: 'number',
				default: 0,
				dependsOn: (p: Props) => !p.custom,
			}),
			getPortDef({
				name: 'thousandSeparated',
				displayName: 'Thousand separated',
				group: 'Params',
				type: 'boolean',
				default: true,
				dependsOn: (p: Props) => !p.custom,
			}),
			getPortDef({
				name: 'currency',
				displayName: 'Currency',
				group: 'Params',
				type: 'boolean',
				default: false,
				dependsOn: (p: Props) => !p.custom,
			}),
			getPortDef({
				name: 'spaceSeparated',
				displayName: 'Space separated',
				group: 'Params',
				type: 'boolean',
				default: true,
				dependsOn: (p: Props) => !p.custom && p.currency === true,
			}),
		],
		outputs: [getPortDef({ name: 'string', displayName: 'String', group: 'Data', type: 'string' })],
	},
	afterNode: {
		triggerOnInputs: () => ['number', 'custom', 'customFormat', 'mantissa', 'thousandSeparated', 'currency', 'spaceSeparated'],
		getInspectInfo: (p: Props, outProps) => [{ type: 'text', value: outProps.string }],
	},
	beforeComponent: {
		initialize: async () => {
			await initState('shared')
		},
	},
	disableCustomProps: true,
} satisfies JsNodeDef

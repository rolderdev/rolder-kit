import initState from '@shared/init-state-v0.1.0'
import type { BaseJsProps } from '@shared/node-v1.0.0'
import type { JsNodeDef } from '@shared/node-v1.0.0'
import { getPortDef } from '@shared/port-v1.0.0'
import { validateUpdateScheme } from './validtaion'
import type { UpdateScheme } from './validtaion'

export type Props = BaseJsProps & { apiVersion: 'v1'; updateScheme?: UpdateScheme; optimistic: boolean }

export default {
	hashTag: '#pre-release',
	module: { dynamic: import('../component/update') },
	inNode: {
		inputs: [
			getPortDef({
				name: 'apiVersion',
				displayName: 'API',
				group: 'Version',
				default: 'v1',
				type: [{ label: 'v1', value: 'v1' }],
				visibleAt: 'editor',
			}),
			getPortDef({
				name: 'updateScheme',
				displayName: 'Update scheme',
				group: 'Params',
				type: 'array',
				validate: (p: Props) => (p.updateScheme ? validateUpdateScheme(p) : true),
			}),
			getPortDef({
				name: 'optimistic',
				displayName: 'Optimistic',
				group: 'Params',
				type: 'boolean',
				default: true,
			}),
			getPortDef({
				name: 'update',
				displayName: 'Update',
				group: 'Signals',
				type: 'signal',
			}),
		],
		outputs: [
			getPortDef({ name: 'updating', displayName: 'Updating', group: 'States', type: 'boolean' }),
			getPortDef({ name: 'updated', displayName: 'Updated', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'data', displayName: 'Data', group: 'Data', type: 'object' }),
		],
	},
	afterNode: {
		getInspectInfo: (p: Props, outProps) => [
			{ type: 'text', value: `API ${p.apiVersion}` },
			{ type: 'text', value: '=== Scheme ===' },
			{ type: 'value', value: p.updateScheme },
			outProps.data && { type: 'text', value: '=== Data ===' },
			outProps.data && { type: 'value', value: outProps.data },
		],
	},
	beforeComponent: {
		initialize: async () => {
			await initState('initialized')
		},
	},
	disableCustomProps: true,
} satisfies JsNodeDef

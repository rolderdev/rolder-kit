import initState from '@shared/init-state-v0.1.0'
import type { BaseJsProps } from '@shared/node-v1.0.0'
import type { JsNodeDef } from '@shared/node-v1.0.0'
import { getPortDef } from '@shared/port-v1.0.0'
import { validateCreateScheme } from './validtaion'
import type { CreateScheme } from './validtaion'

export type Props = BaseJsProps & { apiVersion: 'v1'; createScheme?: CreateScheme }

export default {
	hashTag: '#pre-release',
	module: { dynamic: import('../component/create') },
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
				name: 'createScheme',
				displayName: 'Create scheme',
				group: 'Params',
				type: 'array',
				validate: (p: Props) => (p.createScheme ? validateCreateScheme(p) : true),
			}),
			getPortDef({
				name: 'create',
				displayName: 'Create',
				group: 'Signals',
				type: 'signal',
			}),
		],
		outputs: [
			getPortDef({ name: 'creating', displayName: 'Creating', group: 'States', type: 'boolean' }),
			getPortDef({ name: 'created', displayName: 'Created', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'data', displayName: 'Data', group: 'Data', type: 'object' }),
		],
	},
	afterNode: {
		getInspectInfo: (p: Props, outProps) => [
			{ type: 'text', value: `API ${p.apiVersion}` },
			{ type: 'text', value: '=== Scheme ===' },
			{ type: 'value', value: p.createScheme },
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

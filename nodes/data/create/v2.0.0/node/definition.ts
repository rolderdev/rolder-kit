import type { BaseJsProps } from '@shared/node-v1.0.0';
import type { JsNodeDef } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';
import { validateCreateScheme } from './validtaion';
import type { CreateScheme } from './validtaion';
import initState from '@shared/init-state-v0.1.0';

export type Props = BaseJsProps & { apiVersion: 'v1'; createScheme?: CreateScheme };

export default {
	hashTag: '#expreimental',
	module: { dynamic: import('../component/create') },
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
	getInspectInfo: (p: Props, outProps) => [
		{ type: 'text', value: `API ${p.apiVersion}` },
		{ type: 'text', value: `=== Scheme ===` },
		{ type: 'value', value: p.createScheme },
		outProps.data && { type: 'text', value: `=== Data ===` },
		outProps.data && { type: 'value', value: outProps.data },
	],
	initialize: async () => {
		await initState('initialized');
	},
	disableCustomProps: true,
} satisfies JsNodeDef;

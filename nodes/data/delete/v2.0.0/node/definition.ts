import type { BaseJsProps } from '@shared/node-v1.0.0';
import type { JsNodeDef } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';
import { validateDeleteScheme } from './validtaion';
import type { DeleteScheme } from './validtaion';
import initState from '@shared/init-state-v0.1.0';

export type Props = BaseJsProps & { apiVersion: 'v1'; deleteScheme?: DeleteScheme };

export default {
	hashTag: '#pre-release',
	module: { dynamic: import('../component/delete') },
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
				name: 'deleteScheme',
				displayName: 'Delete scheme',
				group: 'Params',
				type: 'array',
				validate: (p: Props) => (p.deleteScheme ? validateDeleteScheme(p) : true),
			}),
			getPortDef({
				name: 'delete',
				displayName: 'Delete',
				group: 'Signals',
				type: 'signal',
			}),
		],
		outputs: [
			getPortDef({ name: 'deleting', displayName: 'Deleting', group: 'States', type: 'boolean' }),
			getPortDef({ name: 'deleted', displayName: 'Deleted', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'data', displayName: 'Data', group: 'Data', type: 'object' }),
		],
	},
	afterNode: {
		getInspectInfo: (p: Props, outProps) => [
			{ type: 'text', value: `API ${p.apiVersion}` },
			{ type: 'text', value: `=== Scheme ===` },
			{ type: 'value', value: p.deleteScheme },
			outProps.data && { type: 'text', value: `=== Data ===` },
			outProps.data && { type: 'value', value: outProps.data },
		],
	},
	beforeComponent: {
		initialize: async () => {
			await initState('initialized');
		},
	},
	disableCustomProps: true,
} satisfies JsNodeDef;

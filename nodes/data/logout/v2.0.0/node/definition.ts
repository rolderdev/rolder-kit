import { getPortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef, BaseJsProps } from '@shared/node-v1.0.0';
import initState from '@shared/init-state-v0.1.0';

export type Props = BaseJsProps;

export default {
	module: { dynamic: import('../component/logout') },
	inputs: [getPortDef({ name: 'logout', displayName: 'Logout', group: 'Signals', type: 'signal' })],
	initialize: async () => {
		await initState('initialized');
	},
	disableCustomProps: true,
} satisfies JsNodeDef;

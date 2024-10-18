import initState from '@shared/init-state-v0.1.0'
import type { BaseJsProps, JsNodeDef } from '@shared/node-v1.0.0'
import { getPortDef } from '@shared/port-v1.0.0'

export type Props = BaseJsProps

export default {
	module: { dynamic: import('../component/logout') },
	inNode: { inputs: [getPortDef({ name: 'logout', displayName: 'Logout', group: 'Signals', type: 'signal' })] },
	beforeComponent: {
		initialize: async () => {
			await initState('initialized')
		},
	},
	disableCustomProps: true,
} satisfies JsNodeDef

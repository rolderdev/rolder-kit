import initState from '@shared/init-state-v0.1.0'
import type { BaseJsProps, JsNodeDef } from '@shared/node-v1.0.0'
import { clearWarning, sendWarning } from '@shared/node-v1.0.0/src/editorModels/warning'
import { getPortDef } from '@shared/port-v1.0.0'
import { subscribe } from '../component/tableFilter'

export type Props = BaseJsProps & { columnId?: number; filterState?: FilterState; unsub?: () => void }
export type FilterState = { enabled: boolean; value?: any; defaultValue?: any; ids?: readonly string[] }

export default {
	hashTag: '#pre-release',
	module: { dynamic: import('../component/tableFilter') },
	inNode: {
		inputs: [getPortDef({ name: 'close', displayName: 'Close', group: 'Signals', type: 'signal' })],
		outputs: [
			getPortDef({ name: 'subscribed', displayName: 'Subscribed', group: 'States', type: 'boolean' }),
			getPortDef({ name: 'state', displayName: 'State', group: 'States', type: 'object' }),
			getPortDef({ name: 'enabled', displayName: 'Enabled', group: 'States', type: 'boolean' }),
			getPortDef({ name: 'value', displayName: 'Value', group: 'States', type: '*' }),
			getPortDef({ name: 'defaultValue', displayName: 'Default value', group: 'States', type: '*' }),
		],
	},
	afterNode: {
		getInspectInfo: (p: Props) =>
			p.columnId && p.filterState
				? [
						{ type: 'text', value: `Column id: ${p.columnId}` },
						{ type: 'value', value: p.filterState },
					]
				: [],
	},
	beforeComponent: {
		initialize: async (p: Props, noodlNode) => {
			await initState('initialized')

			const filterState = noodlNode.nodeScope.componentOwner.metaData?.filterState

			if (!Noodl.deployed) {
				if (!filterState)
					sendWarning(noodlNode.model, noodlNode.context, 'globalAfter', 'globalAfter', '"tableFilter" must be in Table.')
				else {
					clearWarning(noodlNode.model, noodlNode.context, 'globalAfter', 'globalAfter')
					await subscribe(p, noodlNode)
				}
			} else await subscribe(p, noodlNode)

			// Отпишемся, когда родитель отмонтировался.
			if (noodlNode.nodeScope.componentOwner._forEachNode)
				noodlNode.nodeScope.componentOwner._forEachNode.reactComponentRef.componentWillUnmount = () => p.unsub?.()
			// Отпишемся, когда удален.
			noodlNode._onNodeDeleted = () => p.unsub?.()
		},
	},
	disableCustomProps: true,
} satisfies JsNodeDef

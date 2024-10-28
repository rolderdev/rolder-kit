import initState from '@shared/init-state-v0.1.0'
import type { BaseJsProps } from '@shared/node-v1.0.0'
import type { JsNodeDef } from '@shared/node-v1.0.0'
import { getPortDef } from '@shared/port-v1.0.0'
import type { MultiSelection, NodeExpansion, NodeMultiSelection, NodeSingleSelection, Nodes } from '../component/Node'
import type { HistoryItem, ItemsHistory } from '../component/fetch'
import { unsubscribe } from '../component/handleSubscribe'
import getStore from './store'
import type { Store } from './store'
import { validateFetchScheme } from './validtaion'
import type { FetchScheme } from './validtaion'

export type Props = BaseJsProps & BaseProps & { store: Store }

export type BaseProps = {
	apiVersion: 'v2'
	fetchScheme?: FetchScheme
	outputDbClasses?: string[]
	controlled: boolean
	subscribe: boolean
	enablePagination: boolean
	paginationDbClass: string
	useTargetPage: boolean
}

export type { Nodes, NodeMultiSelection, NodeSingleSelection, NodeExpansion, MultiSelection, HistoryItem, ItemsHistory }

export default {
	hashTag: '#pre-release',
	module: { dynamic: import('../component/useData') },
	inNode: {
		inputs: [
			getPortDef({
				name: 'apiVersion',
				displayName: 'API',
				group: 'Version',
				default: 'v2',
				type: [{ label: 'v2', value: 'v2' }],
				visibleAt: 'editor',
			}),
			getPortDef({
				name: 'fetchScheme',
				displayName: 'Fetch scheme',
				group: 'Params',
				type: 'array',
				validate: (p: Props) => (p.fetchScheme ? validateFetchScheme(p) : true),
			}),
			getPortDef({
				name: 'controlled',
				displayName: 'Controlled',
				group: 'Params',
				type: 'boolean',
				default: false,
				visibleAt: 'editor',
			}),
			getPortDef({
				name: 'subscribe',
				displayName: 'Enable',
				group: 'Custom',
				customGroup: 'Subscribe',
				type: 'boolean',
				default: true,
				visibleAt: 'editor',
				dependsOn: (p: Props) => !p.controlled,
			}),
			getPortDef({
				name: 'enablePagination',
				displayName: 'Enable',
				group: 'Custom',
				customGroup: 'Pagination',
				type: 'boolean',
				default: false,
				visibleAt: 'editor',
				// dependsOn: (p: Props) => !p.controlled,
			}),
			getPortDef({
				name: 'paginationDbClass',
				displayName: 'Pagination class',
				group: 'Custom',
				customGroup: 'Pagination',
				type: 'string',
				default: '',
				visibleAt: 'editor',
				dependsOn: (p: Props) => p.enablePagination,
			}),
			getPortDef({
				name: 'useTargetPage',
				displayName: 'Use target page',
				group: 'Custom',
				customGroup: 'Pagination',
				type: 'boolean',
				default: true,
				visibleAt: 'editor',
				dependsOn: (p: Props) => p.enablePagination,
			}),
			getPortDef({
				name: 'next',
				displayName: 'Next',
				group: 'Custom',
				customGroup: 'Pagination',
				type: 'signal',
				dependsOn: (p: Props) => p.enablePagination,
			}),
			getPortDef({
				name: 'previous',
				displayName: 'Previous',
				group: 'Custom',
				customGroup: 'Pagination',
				type: 'signal',
				dependsOn: (p: Props) => p.enablePagination,
			}),
			getPortDef({
				name: 'fetch',
				displayName: 'Fetch',
				group: 'Signals',
				type: 'signal',
				dependsOn: (p: Props) => p.controlled,
			}),
			getPortDef({
				name: 'outputDbClasses',
				displayName: 'Output DB classes',
				group: 'Custom',
				customGroup: 'Output DB classes',
				type: 'proplist',
				validate: (p: Props) => {
					if (R.dbClasses) {
						const notExistsDbClasses: string[] = []
						for (const i of p.outputDbClasses ?? []) if (!R.dbClasses?.[i]) notExistsDbClasses.push(i)
						if (notExistsDbClasses.length) return `There is no such DB classes as "${notExistsDbClasses.join('", "')}"`
					}
					return true
				},
			}),
			getPortDef({ name: 'resetSingleSelection', displayName: 'Reset single selection', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'resetMultiSelection', displayName: 'Reset multi selection', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'expandAll', displayName: 'Expand all', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'collapseAll', displayName: 'Collapse all', group: 'Signals', type: 'signal' }),
		],
		outputs: [
			getPortDef({ name: 'fetching', displayName: 'Fetching', group: 'States', type: 'boolean' }),
			getPortDef({ name: 'fetched', displayName: 'Fetched', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'data', displayName: 'Data', group: 'Data', type: 'object' }),
			getPortDef({ name: 'rootId', displayName: 'Root node id', group: 'Data', type: 'string' }),
			getPortDef({ name: 'rootNode', displayName: 'Root node', group: 'Data', type: 'object' }),
			getPortDef({ name: 'schemesData', displayName: 'Schemes data', group: 'Data', type: 'array' }),
			getPortDef({ name: 'singleSelectionChanged', displayName: 'Single selection changed', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'multiSelectionChanged', displayName: 'Multi selection changed', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'expansionChanged', displayName: 'Expansion changed', group: 'Signals', type: 'signal' }),
		],
	},
	afterNode: {
		triggerOnInputs: () => ['apiVersion', 'fetchScheme', 'controlled', 'subscribe'],
		transformPorts: async (p: Props, portDefs) => {
			// Пересоздание outputDbClasses
			const dbClasses = p.outputDbClasses
			portDefs.outputs = portDefs.outputs.filter((i) => !i.group?.includes('Data:'))
			if (dbClasses)
				dbClasses.map((dbClass) => {
					portDefs.outputs.push(
						getPortDef({
							name: `${dbClass}Items`,
							group: 'Custom',
							customGroup: `Data: ${dbClass}`,
							type: 'array',
							displayName: `${dbClass} Items`,
						})
					)
					portDefs.outputs.push(
						getPortDef({
							name: `${dbClass}Fetched`,
							group: 'Custom',
							customGroup: `Data: ${dbClass}`,
							type: 'number',
							displayName: `${dbClass} Fetched count`,
						})
					)
					portDefs.outputs.push(
						getPortDef({
							name: `${dbClass}Total`,
							group: 'Custom',
							customGroup: `Data: ${dbClass}`,
							type: 'number',
							displayName: `${dbClass} Total count`,
						})
					)
					portDefs.outputs.push(
						getPortDef({
							name: `${dbClass}Aggregations`,
							group: 'Custom',
							customGroup: `Data: ${dbClass}`,
							type: 'object',
							displayName: `${dbClass} Aggregations`,
						})
					)
				})
		},
		getInspectInfo: (p: Props) => [
			{ type: 'text', value: `API ${p.apiVersion}` },
			{ type: 'text', value: '=== Scheme ===' },
			{ type: 'value', value: p.fetchScheme },
		],
	},
	beforeComponent: {
		initialize: async (p: Props, noodlNode) => {
			await initState('initialized')
			p.store = getStore(p)

			// Отпишемся, когда родитель отмонтировался. Родитель может быть страницей, в таком случае пропустим.
			if (noodlNode.nodeScope.componentOwner.parent?.innerReactComponentRef)
				noodlNode.nodeScope.componentOwner.parent.innerReactComponentRef.componentWillUnmount = () => unsubscribe(p)
			// Отпишемся, когда удален.
			noodlNode._onNodeDeleted = () => unsubscribe(p)
		},
	},
	disableCustomProps: true,
} satisfies JsNodeDef

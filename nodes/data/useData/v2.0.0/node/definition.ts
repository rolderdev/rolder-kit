import type { JsNodeDef } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';
import getStore from './store';
import type { Props } from '../types';
import { validateFetchScheme } from './validtaion';

export default {
	hashTag: '#expreimental',
	module: { dynamic: import('../component/useData') },
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
			validate: (p: Props) => (!p.fetchScheme?.length ? false : validateFetchScheme(p as Props)),
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
			default: false,
			visibleAt: 'editor',
			dependsOn: (p: Props) => (p.controlled ? false : true),
		}),
		getPortDef({
			name: 'fetch',
			displayName: 'Fetch',
			group: 'Signals',
			type: 'signal',
			dependsOn: (p: Props) => (p.controlled ? true : false),
		}),
		getPortDef({
			name: 'outputDbClasses',
			displayName: 'Output DB classes',
			group: 'Custom',
			customGroup: 'Output DB classes',
			type: 'proplist',
		}),
	],
	outputs: [
		getPortDef({ name: 'fetching', displayName: 'Fetching', group: 'States', type: 'boolean' }),
		getPortDef({ name: 'fetched', displayName: 'Fetched', group: 'Signals', type: 'signal' }),
		getPortDef({ name: 'data', displayName: 'Data', group: 'Data', type: 'object' }),
		getPortDef({ name: 'hierarchyRootItem', displayName: 'Hierarchy root item', group: 'Data', type: 'object' }),
		getPortDef({ name: 'schemes', displayName: 'Schemes', group: 'Data', type: 'array' }),
		getPortDef({ name: 'itemsStateChanged', displayName: 'Items state changed', group: 'Signals', type: 'signal' }),
	],
	transform(p: Props, portDefs) {
		// Пересоздание outputDbClasses
		const dbClasses = p.outputDbClasses;
		portDefs.outputs = portDefs.outputs.filter((i) => !i.group.includes('Data:'));
		if (dbClasses)
			dbClasses.map((dbClass) => {
				portDefs.outputs.push({
					...getPortDef({
						name: `${dbClass}Items`,
						group: 'Custom',
						customGroup: `Data: ${dbClass}`,
						type: 'array',
						displayName: `${dbClass} Items`,
					}),
				});
				portDefs.outputs.push(
					getPortDef({
						name: `${dbClass}Fetched`,
						group: 'Custom',
						customGroup: `Data: ${dbClass}`,
						type: 'number',
						displayName: `${dbClass} Fetched`,
					})
				);
				portDefs.outputs.push(
					getPortDef({
						name: `${dbClass}Total`,
						group: 'Custom',
						customGroup: `Data: ${dbClass}`,
						type: 'number',
						displayName: `${dbClass} Total`,
					})
				);
				portDefs.outputs.push(
					getPortDef({
						name: `${dbClass}Aggregations`,
						group: 'Custom',
						customGroup: `Data: ${dbClass}`,
						type: 'object',
						displayName: `${dbClass} Aggregations`,
					})
				);
			});

		return portDefs;
	},
	triggerOnInputs(p: Props) {
		return ['apiVersion', 'fetchScheme', 'controlled', 'subscribe'];
	},
	initialize: async (p: Props) => {
		p.store = getStore(p);
		return p;
	},
	getInspectInfo: (p: Props) => [
		{ type: 'text', value: `API ${p.apiVersion}` },
		{ type: 'text', value: `=== Scheme ===` },
		{ type: 'value', value: p.fetchScheme },
	],
	disableCustomProps: true,
} satisfies JsNodeDef;

import { jsNode } from '@packages/node-v1.0.0';
import { getPortDef } from '@packages/port-v1.0.0';
import { getStore, PropsScheme, validateDbClasses } from './src/v2.0.0';

//////////////////////////////////////////////////////////////////
export const useDataNode = jsNode(
	'useData',
	{
		'v2.0.0': {
			hashTag: '#expreimental',
			module: { dynamic: import('../module/') },
			inputs: [
				getPortDef({
					name: 'apiVersion',
					displayName: 'API',
					group: 'Version',
					default: 'v1',
					type: [
						{ label: 'v0', value: 'v0' },
						{ label: 'v1', value: 'v1' },
					],
					visibleAt: 'editor',
				}),
				getPortDef({
					name: 'fetchScheme',
					displayName: 'Fetch scheme',
					group: 'Params',
					type: 'array',
					validate(p) {
						if (!p.fetchScheme?.length) return false;
						else {
							let result = validateDbClasses(p.fetchScheme);

							const sizeDbClasses: string[] = [];
							const historyDbClasses: string[] = [];
							p.fetchScheme.map((i: any) => {
								if (i.size > 1000) sizeDbClasses.push(i.dbClass);
								if (i.history > 100) historyDbClasses.push(i.dbClass);
							});

							if (sizeDbClasses.length)
								result = `Size should be less or equal 1000.</br>Mismatched DB classes: ${sizeDbClasses.join(', ')}`;
							if (historyDbClasses.length)
								result = `History should be less or equal 100.</br>Mismatched DB classes: ${historyDbClasses.join(', ')}`;

							return typeof result === 'string' ? '<p>Fetch scheme error.</p>' + result : result;
						}
					},
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
					dependsOn(p) {
						return p.controlled ? false : true;
					},
				}),
				getPortDef({
					name: 'useFetchScheme',
					displayName: 'Use fetch scheme',
					group: 'Custom',
					customGroup: 'Subscribe',
					type: 'boolean',
					default: true,
					visibleAt: 'editor',
					dependsOn(p) {
						return p.subscribe ? true : false;
					},
				}),
				getPortDef({
					name: 'subscribeScheme',
					displayName: 'Subscribe scheme',
					group: 'Custom',
					customGroup: 'Subscribe',
					type: 'array',
					dependsOn(p) {
						return p.useFetchScheme === false ? true : false;
					},
					validate(p) {
						const result = p.subscribeScheme ? validateDbClasses(p.subscribeScheme) : true;
						return typeof result === 'string' ? '<p>Subscribe scheme error.</p>' + result : result;
					},
				}),
				getPortDef({
					name: 'fetch',
					displayName: 'Fetch',
					group: 'Signals',
					type: 'signal',
					dependsOn(p) {
						return p.controlled ? true : false;
					},
				}),
			],
			outputs: [
				getPortDef({ name: 'data', displayName: 'Data', group: 'Data', type: 'object' }),
				getPortDef({ name: 'fetching', displayName: 'Fetching', group: 'States', type: 'boolean' }),
				getPortDef({ name: 'fetched', displayName: 'Fetched', group: 'Signals', type: 'signal' }),
			],
			triggerOnInputs(p) {
				return ['apiVersion', 'fetchScheme', 'controlled', 'subscribe', 'useFetchScheme', 'subscribeScheme'];
			},
			async initialize(p) {
				p.store = await getStore(p);
				p.PropsScheme = PropsScheme;
				return p;
			},
			getInspectInfo(p) {
				return [
					{ type: 'text', value: `API ${p.apiVersion}` },
					{ type: 'text', value: `=== Scheme ===` },
					{ type: 'value', value: p.fetchScheme },
				];
			},
			disableCustomProps: true,
		},
	},
	{ docs: 'https://docs.rolder.app/#/useData' }
);

import { jsNode } from '@packages/node-v1.0.0';
import { getPortDef } from '@packages/port-v1.0.0';

export default jsNode(
	'search',
	{
		'v0.1.0': {
			hashTag: '#expreimental',
			module: { dynamic: import('@packages/search-v0.1.0') },
			inputs: [
				getPortDef({
					name: 'fields',
					displayName: 'Fields',
					group: 'Params',
					type: 'array',
					tooltip: `Fields to search`,
					validate(p) {
						return p.fields?.length ? true : false;
					},
				}),
				getPortDef({
					name: 'minMatchCharLength',
					displayName: 'Min length',
					group: 'Params',
					type: 'number',
					default: 2,
					validate(p) {
						return p.minMatchCharLength === 0 ? 'Min length must be 1 or greater.' : true;
					},
				}),
				getPortDef({
					name: 'customOptions',
					displayName: 'Custom options',
					group: 'Params',
					type: 'objectEval',
					codeComment: '// (props) => ({ isCaseSensitive: true })',
					tooltip: `Fuse search options`,
				}),
				getPortDef({
					name: 'searchString',
					displayName: 'Search string',
					group: 'Params',
					type: 'string',
					visibleAt: 'connection',
				}),
				getPortDef({ name: 'items', displayName: 'Items', group: 'Data', type: 'array' }),
			],
			outputs: [
				getPortDef({ name: 'items', displayName: 'Items', group: 'Data', type: 'array' }),
				getPortDef({ name: 'count', displayName: 'Count', group: 'Data', type: 'number' }),
			],
			triggerOnInputs(p) {
				return ['searchString'];
			},
			getInspectInfo(p) {
				if (p.fields)
					return [
						{ type: 'text', value: 'Search fields' },
						{ type: 'value', value: p.fields },
					];
				else return [];
			},
			disableCustomProps: true,
		},
	},
	{ color: 'purple' }
);

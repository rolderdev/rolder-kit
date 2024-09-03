import { getPortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef, BaseJsProps } from '@shared/node-v1.0.0';
import type { Item } from '@shared/types-v0.1.0';
import type { IFuseOptions } from 'fuse.js';

export type Props = BaseJsProps & {
	fields?: string[];
	minMatchCharLength?: number;
	searchString?: string;
	customOptions?: IFuseOptions<Item>;
	items?: Item[];
};

export default {
	hashTag: '#expreimental',
	module: { dynamic: import('../component/search') },
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
	triggerOnInputs: () => ['searchString'],
	getInspectInfo: (p: Props) =>
		p.fields
			? [
					{ type: 'text', value: 'Search fields' },
					{ type: 'value', value: p.fields },
			  ]
			: [],
	disableCustomProps: true,
} satisfies JsNodeDef;

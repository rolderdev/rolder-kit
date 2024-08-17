import { getPortDef } from '@shared/port-v1.0.0';
import { ReactNodeDef } from '@shared/node-v1.0.0';
import { lazy } from 'react';

export default {
	hashTag: '#expreimental',
	module: { dynamic: lazy(() => import('../component/Stack')) },
	inputs: [
		getPortDef({
			name: 'w',
			displayName: 'Width',
			group: 'Dimensions',
			type: 'string',
		}),
		getPortDef({
			name: 'h',
			displayName: 'Height',
			group: 'Dimensions',
			type: 'string',
		}),
		getPortDef({
			name: 'align',
			displayName: 'Align',
			group: 'Layout',
			type: [
				{ label: 'Stretch', value: 'stretch' },
				{ label: 'Center', value: 'center' },
				{ label: 'Flex start', value: 'flex-start' },
				{ label: 'Flex end', value: 'flex-end' },
			],
			default: 'stretch',
		}),
		getPortDef({
			name: 'justify',
			displayName: 'Justify',
			group: 'Layout',
			type: [
				{ label: 'Center', value: 'center' },
				{ label: 'Flex start', value: 'flex-start' },
				{ label: 'Flex end', value: 'flex-end' },
				{ label: 'Space between', value: 'space-between' },
				{ label: 'Space around', value: 'space-around' },
			],
			default: 'flex-start',
		}),
		getPortDef({
			name: 'gap',
			displayName: 'Gap',
			group: 'Layout',
			type: [
				{ value: '0', label: 'none' },
				{ label: 'xs', value: 'xs' },
				{ label: 'sm', value: 'sm' },
				{ label: 'md', value: 'md' },
				{ label: 'lg', value: 'lg' },
				{ label: 'xl', value: 'xl' },
			],
			default: 'md',
		}),
	],
	outputs: [],
	getInspectInfo(p) {
		if (p.size) return [{ type: 'text', value: `Size: "${p.size}"` }];
		else return [];
	},
} satisfies ReactNodeDef;

const aligns = ['stretch', 'center', 'flex-start', 'flex-end'];
const justifies = ['center', 'flex-start', 'flex-end', 'space-between', 'space-around'];

/* 
export default reactNode(
	'Stack',
	{		
		'v2.0.0': {

				getPort({
					plug: 'input',
					name: 'gap',
					displayName: 'Gap',
					group: 'Layout',
					default: 'md',
					type: getEnumType([{ value: '0', label: 'none' }, ...enums.sizes]),
				}),
				...inputGroups.Margins,
				...inputGroups.Paddings,
				...getPorts('input', ['customProps', 'opacity']),
			],
		},
	},
	{ allowChildren: true }
);
 */

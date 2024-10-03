import { getPortDef, margins, paddings, sizes } from '@shared/port-v1.0.0';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps & {};

import Comp from '../component/Stack';

export default {
	hashTag: '#pre-release',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({ name: 'w', displayName: 'Width', group: 'Dimensions', type: 'string' }),
			getPortDef({ name: 'h', displayName: 'Height', group: 'Dimensions', type: 'string' }),
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
				type: [{ value: '0', label: 'none' }, ...sizes],
				default: 'md',
			}),
			getPortDef({ name: 'opacity', displayName: 'Opacity', group: 'Styles', type: 'number', default: 1 }),
			...margins,
			...paddings,
		],
	},
} satisfies ReactNodeDef;

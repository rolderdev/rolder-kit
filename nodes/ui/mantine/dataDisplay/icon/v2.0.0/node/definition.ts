import { getPortDef, sizes } from '@shared/port-v1.0.0';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';
import type { ThemeIconVariant } from '@mantine/core';
import type { Icons } from 'shared';

export type Props = BaseReactProps & {
	name?: keyof Icons;
	variant: ThemeIconVariant;
	stroke?: number;
	iconSize?: number;
};

import Comp from '../component/Icon';

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({ name: 'name', displayName: 'Icon name', group: 'Params', type: 'string' }),
			getPortDef({ name: 'size', displayName: 'Size', group: 'Dimensions', type: sizes, default: 'md' }),
			getPortDef({ name: 'iconSize', displayName: 'Icon size', group: 'Dimensions', type: 'number', default: 24 }),
			getPortDef({
				name: 'variant',
				displayName: 'Variant',
				group: 'Styles',
				type: [
					{ value: 'white', label: 'White' },
					{ value: 'filled', label: 'Filled' },
					{ value: 'light', label: 'Light' },
					{ value: 'outline', label: 'Outline' },
					{ value: 'default', label: 'Default' },
					{ value: 'gradient', label: 'Gradient' },
				],
				default: 'white',
			}),
			getPortDef({
				name: 'gradient',
				displayName: 'Gradient',
				group: 'Styles',
				type: 'objectEval',
				dependsOn: (p: Props) => p.variant === 'gradient',
				codeComment: `//(props) => ({ from: 'blue', to: 'cyan', deg: 90 })`,
			}),
			getPortDef({ name: 'radius', displayName: 'Radius', group: 'Styles', type: sizes, default: 'md' }),
			getPortDef({ name: 'color', displayName: 'Color', group: 'Styles', type: 'string', default: 'blue' }),
			getPortDef({ name: 'stroke', displayName: 'Stroke', group: 'Styles', type: 'number', default: 2 }),
		],
	},
	disableCustomProps: true,
} satisfies ReactNodeDef;

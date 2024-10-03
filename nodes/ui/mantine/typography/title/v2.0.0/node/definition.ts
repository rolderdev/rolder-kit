import { getPortDef } from '@shared/port-v1.0.0';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps & {
	type: 'string' | 'number';
	stringValue?: string;
	numberValue?: number;
	orderProp: 'string';
	variant: 'text' | 'gradient';
};

import Comp from '../component/Title';

export default {
	hashTag: '#pre-release',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({
				name: 'type',
				displayName: 'Type',
				group: 'Data',
				type: [
					{ label: 'String', value: 'string' },
					{ label: 'Number', value: 'number' },
				],
				default: 'string',
			}),
			getPortDef({
				name: 'stringValue',
				displayName: 'Value',
				group: 'Data',
				type: 'string',
				multiline: true,
				dependsOn: (p: Props) => p.type === 'string',
			}),
			getPortDef({
				name: 'numberValue',
				displayName: 'Value',
				group: 'Data',
				type: 'number',
				dependsOn: (p: Props) => p.type === 'number',
			}),
			getPortDef({
				name: 'orderProp',
				displayName: 'Order',
				group: 'Params',
				type: [
					{ label: 'H1', value: '1' },
					{ label: 'H2', value: '2' },
					{ label: 'H3', value: '3' },
					{ label: 'H4', value: '4' },
					{ label: 'H5', value: '5' },
					{ label: 'H6', value: '6' },
				],
				default: '3',
			}),
			getPortDef({
				name: 'textWrap',
				displayName: 'Text wrap',
				group: 'Params',
				type: [
					{ label: 'Wrap', value: 'wrap' },
					{ label: 'No wrap', value: 'nowrap' },
					{ label: 'Balance', value: 'balance' },
					{ label: 'Pretty', value: 'pretty' },
					{ label: 'Stable', value: 'stable' },
				],
				default: 'wrap',
			}),
			getPortDef({
				name: 'tt',
				displayName: 'Transform',
				group: 'Params',
				type: [
					{ label: 'Disabled', value: 'disabled' },
					{ label: 'Capitalize', value: 'capitalize' },
					{ label: 'Uppercase', value: 'uppercase' },
					{ label: 'Lowercase', value: 'lowercase' },
				],
				default: 'disabled',
			}),
			getPortDef({
				name: 'lineClamp',
				displayName: 'Line clamp',
				group: 'Params',
				type: 'number',
			}),
			getPortDef({
				name: 'variant',
				displayName: 'Variant',
				group: 'Styles',
				type: [
					{ label: 'Text', value: 'text' },
					{ label: 'Gradient', value: 'gradient' },
				],
				default: 'text',
			}),
			getPortDef({
				name: 'c',
				displayName: 'Color',
				group: 'Styles',
				type: 'string',
				dependsOn: (p: Props) => p.variant === 'text',
			}),
			getPortDef({
				name: 'gradient',
				displayName: 'Gradient',
				group: 'Styles',
				type: 'objectEval',
				dependsOn: (p: Props) => p.variant === 'gradient',
				codeComment: `//(props) => ({ from: 'blue', to: 'cyan', deg: 90 })`,
			}),
			getPortDef({
				name: 'td',
				displayName: 'Decoration (CSS)',
				group: 'Styles',
				type: 'string',
			}),
		],
	},
	afterNode: {
		getInspectInfo: (p: Props) =>
			p.stringValue || p.numberValue ? [{ type: 'text', value: p.stringValue || p.numberValue }] : [],
	},
} satisfies ReactNodeDef;

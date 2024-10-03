import { getPortDef, sizes } from '@shared/port-v1.0.0';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps & {
	type: 'string' | 'number';
	stringValue?: string;
	numberValue?: number;
	variant: 'text' | 'gradient';
	truncateProp: 'disabled' | 'end' | 'start';
};

import Comp from '../component/Anchor';

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
			getPortDef({ name: 'href', displayName: 'Link', group: 'Data', type: 'string', multiline: true }),
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
				name: 'fz',
				displayName: 'Size',
				group: 'Dimensions',
				type: sizes,
				default: 'md',
			}),
			getPortDef({
				name: 'lh',
				displayName: 'Line height',
				group: 'Dimensions',
				type: [{ label: 'Inline', value: '1' }, ...sizes],
				default: 'md',
			}),
			getPortDef({
				name: 'ta',
				displayName: 'Align',
				group: 'Layout',
				type: [
					{ label: 'Disabled', value: 'disabled' },
					{ label: 'Start', value: 'start' },
					{ label: 'End', value: 'end' },
					{ label: 'Center', value: 'center' },
					{ label: 'Justify', value: 'justify' },
				],
				default: 'disabled',
			}),
			getPortDef({
				name: 'truncateProp',
				displayName: 'Truncate',
				group: 'Layout',
				type: [
					{ label: 'Disabled', value: 'disabled' },
					{ label: 'End', value: 'end' },
					{ label: 'Start', value: 'start' },
				],
				default: 'disabled',
			}),
			getPortDef({
				name: 'lineClamp',
				displayName: 'Line clamp',
				group: 'Layout',
				type: 'number',
			}),
			getPortDef({
				name: 'span',
				displayName: 'Span',
				group: 'Layout',
				type: 'boolean',
				default: false,
			}),
			getPortDef({
				name: 'fw',
				displayName: 'Weight',
				group: 'Styles',
				type: [
					{ label: 'Regular', value: '400' },
					{ label: 'Medium', value: '500' },
					{ label: 'Bold', value: '700' },
				],
				default: '400',
			}),
			getPortDef({
				name: 'underline',
				displayName: 'Underline',
				group: 'Styles',
				type: [
					{ label: 'Never', value: 'never' },
					{ label: 'Hover', value: 'hover' },
					{ label: 'Always', value: 'always' },
				],
				default: 'never',
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

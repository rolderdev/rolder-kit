import { getPortDef, sizes } from '@shared/port-v1.0.0';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';
import type { Item } from '@shared/types-v0.1.0';

export type Props = BaseReactProps & {
	sourceType: 'item' | 'value';
	value?: string;
	item?: Item;
	field: string;
};

import Comp from '../component/Text';

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	inputs: [
		getPortDef({
			name: 'sourceType',
			displayName: 'Source type',
			group: 'Params',
			type: [
				{ label: 'Item', value: 'item' },
				{ label: 'Value', value: 'value' },
			],
			default: 'item',
		}),
		getPortDef({
			name: 'value',
			displayName: 'Value',
			group: 'Data',
			type: 'string',
			dependsOn: (p: Props) => p.sourceType === 'value',
		}),
		getPortDef({
			name: 'item',
			displayName: 'Item',
			group: 'Data',
			type: 'object',
			visibleAt: 'connection',
			dependsOn: (p: Props) => p.sourceType === 'item',
		}),
		getPortDef({
			name: 'field',
			displayName: 'Field',
			group: 'Params',
			type: 'string',
			dependsOn: (p: Props) => p.sourceType === 'item',
			validate: (p: Props) => (p.sourceType === 'item' && !p.field ? false : true),
		}),
		getPortDef({
			name: 'size',
			displayName: 'Size',
			group: 'Custom',
			customGroup: 'Font',
			type: sizes,
			default: 'md',
		}),
		getPortDef({
			name: 'c',
			displayName: 'Color',
			group: 'Styles',
			type: 'string',
			/* customs: {
				dependsOn(p) {
					return p.variant === 'text';
				}
			} */
		}),
	],
	getInspectInfo: (p) => (p.size ? [{ type: 'text', value: `Size: "${p.size}"` }] : []),
} satisfies ReactNodeDef;

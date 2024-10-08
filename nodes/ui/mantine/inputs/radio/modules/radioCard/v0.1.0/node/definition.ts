import { getPortDef, margins, paddings, sizes } from '@shared/port-v1.0.0';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps & { inGroup: boolean; checkedProp: boolean };

import Comp from '../component/RadioCard';

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({ name: 'inGroup', displayName: 'In RadioGroup', group: 'Params', type: 'boolean', default: false }),
			getPortDef({ name: 'value', displayName: 'Value', group: 'Params', type: 'string' }),
			getPortDef({
				name: 'checkedProp',
				displayName: 'Checked',
				group: 'States',
				type: 'boolean',
				default: false,
				dependsOn: (p: Props) => !p.inGroup,
			}),
			getPortDef({ name: 'disabled', displayName: 'Disabled', group: 'States', type: 'boolean', default: false }),
			getPortDef({ name: 'withBorder', displayName: 'With border', group: 'Styles', type: 'boolean', default: true }),
			getPortDef({
				name: 'radius',
				displayName: 'Radius',
				group: 'Styles',
				type: [{ value: '0', label: 'none' }, ...sizes],
				default: 'md',
			}),
			...margins,
			...paddings,
		],
		outputs: [
			getPortDef({
				name: 'checked',
				displayName: 'Checked',
				group: 'States',
				type: 'boolean',
				dependsOn: (p: Props) => !p.inGroup,
			}),
			getPortDef({
				name: 'changed',
				displayName: 'Changed',
				group: 'Signals',
				type: 'signal',
				dependsOn: (p: Props) => !p.inGroup,
			}),
		],
	},
} satisfies ReactNodeDef;

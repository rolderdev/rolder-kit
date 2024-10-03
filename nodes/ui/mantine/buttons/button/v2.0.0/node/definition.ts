import { getPortDef } from '@shared/port-v1.0.0';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps & {};

import Comp from '../component/Button';

export default {
	hashTag: '#pre-release',
	module: { static: Comp },
	outputs: [getPortDef({ name: 'clicked', displayName: 'Clicked', group: 'Signals', type: 'signal' })],
} satisfies ReactNodeDef;

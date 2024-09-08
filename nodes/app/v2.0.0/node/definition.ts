import { getPortDef } from '@shared/port-v1.0.0';
import type { ReactNodeDef } from '@shared/node-v1.0.0';
import type { BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps & {
	multiInstance?: boolean;
};

import { createBlob } from 'rxdb';
type Rxdb = { createBlob: typeof createBlob };
export type { Rxdb };
export type { RxDatabase } from 'rxdb';

// Поскольку HyperDX не используется в коде с этого статичного импорта, он не попадает в этот файл.
import type HyperDX from '@hyperdx/browser';
type HyperDX = typeof HyperDX;
export type { HyperDX };

import Comp from '../component/App';

export default {
	hashTag: '#pre-release',
	module: { static: Comp },
	inputs: [
		getPortDef({
			name: 'multiInstance',
			displayName: 'Multi local DB instance',
			group: 'Params',
			type: 'boolean',
			default: true,
			visibleAt: 'editor',
		}),
	],
	outputs: [
		getPortDef({
			name: 'networkConnected',
			displayName: 'Connected',
			group: 'Custom',
			customGroup: 'Network',
			type: 'boolean',
		}),
		getPortDef({
			name: 'networkType',
			displayName: 'Type',
			group: 'Custom',
			customGroup: 'Network',
			type: 'string',
		}),
	],
	getInspectInfo: (p, outProps) =>
		outProps.networkConnected &&
		outProps.networkType && [
			{ type: 'value', value: `Network connected: ${outProps.networkConnected}` },
			{ type: 'value', value: `Network type: ${outProps.networkType}` },
		],
	disableCustomProps: true,
} satisfies ReactNodeDef;

import { lazy } from 'react';
import { getPortDef } from '@shared/port-v1.0.0';
import type { ReactNodeDef } from '@shared/node-v1.0.0';

import { createBlob } from 'rxdb';
type CreateBlob = typeof createBlob;
export type { CreateBlob };
export type { RxDatabase } from 'rxdb';

// Поскольку HyperDX не используется в коде с этого статичного импорта, он не попадает в этот файл.
import type HyperDX from '@hyperdx/browser';
type HyperDX = typeof HyperDX;
export type { HyperDX };

export default {
	hashTag: '#expreimental',
	module: { dynamic: lazy(() => import('../component/App')) },
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
	getInspectInfo(p, outProps) {
		if (outProps.networkConnected && outProps.networkType)
			return [
				{ type: 'value', value: `Network connected: ${outProps.networkConnected}` },
				{ type: 'value', value: `Network type: ${outProps.networkType}` },
			];
		else return [];
	},
	disableCustomProps: true,
} satisfies ReactNodeDef;

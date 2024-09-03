import { lazy } from 'react';
import type { BaseReactProps } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';
import type { Item } from '@shared/types-v0.1.0';
import type { ReactNodeDef } from '@shared/node-v1.0.0';
import type { QueryClientT as QueryClient, Mutate } from '../component/Data';

export type { QueryClient, Mutate };

export type Props = BaseReactProps & {
	dbName: string;
	backendDevMode?: boolean;
	backendUrl?: string;
	backendPort?: number;
};

export type MutationFnProps = {
	action: 'create' | 'update' | 'delete';
	scheme: {
		dbClass: string;
		items: Item[];
	}[];
	silent?: boolean;
};

export default {
	hashTag: '#expreimental',
	module: { dynamic: lazy(() => import('../component/Data')) },
	inputs: [
		getPortDef({
			name: 'dbName',
			displayName: 'DB name',
			group: 'Params',
			type: 'string',
			visibleAt: 'editor',
			validate: (p: Props) => (p.dbName ? true : false),
		}),
		getPortDef({
			name: 'backendDevMode',
			displayName: 'Backend dev mode',
			group: 'Params',
			type: 'boolean',
			default: false,
			visibleAt: 'editor',
		}),
		getPortDef({
			name: 'backendUrl',
			displayName: 'Backend url',
			group: 'Params',
			type: 'string',
			default: 'localhost',
			visibleAt: 'editor',
			dependsOn: (p: Props) => (p.backendDevMode ? true : false),
			validate: (p: Props) => (p.backendDevMode ? (p.backendUrl ? true : false) : true),
		}),
		getPortDef({
			name: 'backendPort',
			displayName: 'Backend port',
			group: 'Params',
			type: 'number',
			default: 7512,
			dependsOn: (p: Props) => (p.backendDevMode ? true : false),
			validate: (p: Props) => (p.backendDevMode ? (p.backendPort ? true : false) : true),
		}),
	],
	outputs: [getPortDef({ name: 'initialized', displayName: 'Initialized', group: 'Signals', type: 'signal' })],
	getInspectInfo: (p: Props, outProps) => [{ type: 'value', value: `DB name: ${p.dbName}` }],
	/* validate: async (p: Props) => validate(p),
	initialize: async (p: Props) => {
		// Нужно дождаться инициализации сети в R.db
		const interval = setInterval(async () => {
			if (R.db?.states?.network) {
				clearInterval(interval);
				await initialize(p);
			}
		}, 10);
		return p;
	}, */
	disableCustomProps: true,
} satisfies ReactNodeDef;

import { lazy } from 'react';
import type { BaseProps } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';
import type { ReactNodeDef } from '@shared/node-v1.0.0';
import initialize from './initialize';

export type Props = BaseProps & {
	dbName: string;
	backendDevMode?: boolean;
	backendUrl?: string;
	backendPort?: number;
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
	getInspectInfo: (p: Props, outProps, noodlNode) => [
		{ type: 'value', value: `DB: ${p.dbName}` },
		noodlNode._internal.host &&
			noodlNode._internal.port && { type: 'value', value: `Host: ${noodlNode._internal.host}:${noodlNode._internal.port}` },
	],
	initialize: async (p: Props, noodlNode) => {
		// Нужно дождаться инициализации сети в R.db
		await new Promise((resolve) => {
			const interval = setInterval(async () => {
				if (R.db?.states?.network) {
					clearInterval(interval);
					await initialize(p, noodlNode);
					resolve(undefined);
				}
			}, 10);
		});
	},
	disableCustomProps: true,
} satisfies ReactNodeDef;

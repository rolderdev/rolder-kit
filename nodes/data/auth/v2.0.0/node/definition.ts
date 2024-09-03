import { lazy } from 'react';
import type { BaseReactProps } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';
import type { ReactNodeDef } from '@shared/node-v1.0.0';
import ms from 'ms';
import validate from './validate';
import initialize from './initialize';

export type Props = BaseReactProps & {
	sessionTimeout: string;
	username?: string;
	password?: string;
};

export default {
	hashTag: '#expreimental',
	module: { dynamic: lazy(() => import('../component/Auth')) },
	inputs: [
		getPortDef({
			name: 'sessionTimeout',
			displayName: 'Session timeout',
			group: 'Params',
			type: 'string',
			default: '5d',
			visibleAt: 'editor',
			validate: (p: Props) =>
				p.sessionTimeout && ms(p.sessionTimeout) >= 360000 ? true : 'Session timeout must 1 hour or greater',
		}),
		getPortDef({
			name: 'username',
			displayName: 'Username',
			group: 'Params',
			type: 'string',
			visibleAt: 'connection',
		}),
		getPortDef({
			name: 'password',
			displayName: 'Password',
			group: 'Params',
			type: 'string',
			visibleAt: 'connection',
		}),
		getPortDef({ name: 'signIn', displayName: 'Sign in', group: 'Signals', type: 'signal' }),
	],
	outputs: [
		getPortDef({ name: 'userRole', displayName: 'User role', group: 'Params', type: 'string' }),
		getPortDef({ name: 'signingIn', displayName: 'Signing in', group: 'States', type: 'boolean' }),
		getPortDef({ name: 'signedIn', displayName: 'Signed in', group: 'Signals', type: 'signal' }),
		getPortDef({ name: 'signedOut', displayName: 'Signed out', group: 'Signals', type: 'signal' }),
	],
	getInspectInfo: (p: Props, outProps) => {
		if (outProps.networkConnected && outProps.networkType)
			return [
				{ type: 'value', value: `Network connected: ${outProps.networkConnected}` },
				{ type: 'value', value: `Network type: ${outProps.networkType}` },
			];
		else return [];
	},
	validate: async (p: Props) => validate(p),
	initialize: async (p: Props) => {
		// Нужно дождаться инициализации сети в R.db
		const interval = setInterval(async () => {
			if (R.db?.states?.network) {
				clearInterval(interval);
				await initialize(p);
			}
		}, 10);
		return p;
	},
	disableCustomProps: true,
} satisfies ReactNodeDef;

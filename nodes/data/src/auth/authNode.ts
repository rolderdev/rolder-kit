import { reactNode } from '@packages/node';
import { getPort, getType } from '@packages/port';
import { lazy } from 'react';
import ms from 'ms';

export default reactNode(
	'Auth',
	{
		'v1.0.0': {
			module: { dynamic: lazy(() => import('@packages/auth-v1.0.0')) },
			inputs: [
				getPort({
					plug: 'input',
					name: 'sessionTimeout',
					displayName: 'Session timeout',
					group: 'Params',
					type: 'string',
					default: '5d',
					customs: {
						required: 'both',
						validate(p) {
							return ms(p.sessionTimeout as string) >= 360000 ? true : 'Session timeout must 1 hour or greater';
						}
					}
				}),
				getPort({
					plug: 'input',
					name: 'username',
					displayName: 'Username',
					group: 'Params',
					type: getType('string', 'connection')
				}),
				getPort({
					plug: 'input',
					name: 'password',
					displayName: 'Password',
					group: 'Params',
					type: getType('string', 'connection')
				}),
				getPort({ plug: 'input', name: 'signIn', displayName: 'Sign in', group: 'Signals', type: 'signal' })
			],
			outputs: [
				getPort({ plug: 'output', name: 'userRole', displayName: 'User role', group: 'Params', type: 'string' }),
				getPort({ plug: 'output', name: 'signedIn', displayName: 'Signed in', group: 'Signals', type: 'signal' }),
				getPort({ plug: 'output', name: 'signedOut', displayName: 'Signed out', group: 'Signals', type: 'signal' }),
				getPort({ plug: 'output', name: 'signInFailed', displayName: 'Sign in failed', group: 'Signals', type: 'signal' }),
				getPort({ plug: 'output', name: 'error', displayName: 'Error', group: 'Params', type: 'string' })
			]
		}
	},
	{ allowChildren: true }
);

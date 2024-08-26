import { getPortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef } from '@shared/node-v1.0.0';
import type { Props } from '../types';

export default {
	hashTag: '#expreimental',
	module: { dynamic: import('../component/notification') },
	inputs: [
		getPortDef({ name: 'title', displayName: 'Title', group: 'Params', type: 'string' }),
		getPortDef({
			name: 'message',
			displayName: 'Message',
			group: 'Params',
			type: 'string',
			validate: (p: Props) => (p.message ? true : false),
		}),
		getPortDef({ name: 'autoClose', displayName: 'Auto close', group: 'Params', type: 'boolean', default: true }),
		getPortDef({
			name: 'autoCloseTimeout',
			displayName: 'Auto close timeout',
			group: 'Params',
			type: 'number',
			default: 2000,
			dependsOn: (p: Props) => (p.autoClose ? true : false),
		}),
		getPortDef({ name: 'send', displayName: 'Send', group: 'Signals', type: 'signal' }),
	],
	getInspectInfo: (p: Props) => [
		{ type: 'text', value: `Title: ${p.title}` },
		{ type: 'text', value: `Message: ${p.message}` },
	],
	disableCustomProps: true,
} satisfies JsNodeDef;

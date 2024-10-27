import type { BaseJsProps, JsNodeDef } from '@shared/node-v1.0.0'
import { getPortDef } from '@shared/port-v1.0.0'

export type Props = BaseJsProps & {
	title?: string
	message: string
	color?: string
	autoClose?: boolean
	autoCloseTimeout?: number
}

import Comp from '../component/notification'

export default {
	module: { static: Comp },
	inNode: {
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
			getPortDef({
				name: 'color',
				displayName: 'Color',
				group: 'Styles',
				type: 'string',
				default: 'blue',
			}),
			getPortDef({ name: 'send', displayName: 'Send', group: 'Signals', type: 'signal' }),
		],
	},
	afterNode: {
		getInspectInfo: (p: Props) => [
			{ type: 'text', value: `Title: ${p.title}` },
			{ type: 'text', value: `Message: ${p.message}` },
		],
	},
	disableCustomProps: true,
} satisfies JsNodeDef

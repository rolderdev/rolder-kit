import type { BaseReactProps, ReactNodeDef } from '@shared/node-v1.0.0'
import { getPortDef, margins, paddings } from '@shared/port-v1.0.0'

export type Props = BaseReactProps & { autosize: boolean; toScrollPosition?: number }

import Comp from '../component/ScrollArea'

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	inNode: {
		inputs: [
			getPortDef({ name: 'autosize', displayName: 'Autosize', group: 'Dimensions', type: 'boolean', default: false }),
			getPortDef({ name: 'w', displayName: 'Width', group: 'Dimensions', type: 'string', dependsOn: (p: Props) => !p.autosize }),
			getPortDef({ name: 'h', displayName: 'Height', group: 'Dimensions', type: 'string', dependsOn: (p: Props) => !p.autosize }),
			getPortDef({
				name: 'miw',
				displayName: 'Max width',
				group: 'Dimensions',
				type: 'string',
				dependsOn: (p: Props) => p.autosize,
			}),
			getPortDef({
				name: 'mah',
				displayName: 'Max height',
				group: 'Dimensions',
				type: 'string',
				dependsOn: (p: Props) => p.autosize,
			}),
			getPortDef({
				name: 'type',
				displayName: 'Type',
				group: 'Params',
				type: [
					{ label: 'Hover', value: 'hover' },
					{ label: 'Auto', value: 'auto' },
					{ label: 'Always', value: 'always' },
					{ label: 'Scroll', value: 'scroll' },
					{ label: 'Never', value: 'never' },
				],
				default: 'hover',
			}),
			getPortDef({
				name: 'scrollbars',
				displayName: 'Scrollbars',
				group: 'Params',
				type: [
					{ label: 'xy', value: 'xy' },
					{ label: 'y', value: 'y' },
					{ label: 'x', value: 'x' },
				],
				default: 'xy',
			}),
			getPortDef({ name: 'scrollbarSize', displayName: 'Scrollbar size', group: 'Params', type: 'number', default: 10 }),
			getPortDef({
				name: 'offsetScrollbars',
				displayName: 'Offset scrollbars',
				group: 'Params',
				type: 'boolean',
				default: false,
			}),
			getPortDef({
				name: 'scrollHideDelay',
				displayName: 'Scrollbar hide delay',
				group: 'Params',
				type: 'number',
				default: 1000,
				dependsOn: (p) => p.type === 'hover' || p.type === 'scroll',
			}),
			getPortDef({ name: 'toScrollPosition', displayName: 'To scroll position', group: 'Params', type: 'number' }),
			getPortDef({ name: 'opacity', displayName: 'Opacity', group: 'Styles', type: 'number', default: 1 }),
			...margins,
			...paddings,
			getPortDef({ name: 'scrollToTop', displayName: 'Scroll to top', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'scrollToBottom', displayName: 'Scroll to bottom', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'scrollToPosition', displayName: 'Scroll to position', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'getScrollHeight', displayName: 'Get scroll height', group: 'Signals', type: 'signal' }),
		],
		outputs: [
			getPortDef({ name: 'scrollHeight', displayName: 'Scroll height', group: 'Data', type: 'number' }),
			getPortDef({ name: 'scrollPosition', displayName: 'Scroll position', group: 'Data', type: 'object' }),
			getPortDef({ name: 'topReached', displayName: 'Top reached', group: 'Signals', type: 'signal' }),
			getPortDef({ name: 'bottomReached', displayName: 'Bottom reached', group: 'Signals', type: 'signal' }),
		],
	},
	afterNode: { getInspectInfo: (p: Props, outPtops, noodlNode) => [{ type: 'value', value: noodlNode._internal.pos }] },
} satisfies ReactNodeDef

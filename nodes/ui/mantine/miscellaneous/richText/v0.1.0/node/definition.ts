import { lazy } from 'react';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';

export type Props = BaseReactProps & {
	isEditor: boolean;
	sticky: boolean;
	stickyOffset?: string;
	content?: string;
	height?: string;
	maxHeight?: string;
};

export default {
	hashTag: '#pre-release',
	module: { dynamic: lazy(() => import('../component/RichText')) },
	inputs: [
		getPortDef({
			name: 'isEditor',
			displayName: 'Editor',
			group: 'Params',
			type: 'boolean',
			default: false,
		}),
		getPortDef({
			name: 'sticky',
			displayName: 'Sticky toolbar',
			group: 'Layout',
			type: 'boolean',
			default: true,
		}),
		getPortDef({
			name: 'stickyOffset',
			displayName: 'Sticky offset',
			group: 'Layout',
			type: 'string',
			dependsOn: (p: Props) => p.sticky,
		}),
		getPortDef({ name: 'content', displayName: 'Content', group: 'Data', type: 'string', multiline: true }),
		getPortDef({ name: 'height', displayName: 'Height (CSS)', group: 'Dimensions', type: 'string' }),
		getPortDef({ name: 'maxHeight', displayName: 'Max height (CSS)', group: 'Dimensions', type: 'string' }),
		getPortDef({ name: 'toggleEditor', displayName: 'Toggle editor', group: 'Signals', type: 'signal' }),
		getPortDef({ name: 'restore', displayName: 'Restore content', group: 'Signals', type: 'signal' }),
		getPortDef({ name: 'restoreAndToggle', displayName: 'Restore and toggle', group: 'Signals', type: 'signal' }),
		getPortDef({ name: 'clear', displayName: 'Clear content', group: 'Signals', type: 'signal' }),
	],
	outputs: [
		getPortDef({ name: 'html', displayName: 'HTML', group: 'Data', type: 'string' }),
		getPortDef({ name: 'isEditor', displayName: 'Is editor', group: 'States', type: 'boolean' }),
	],
	getInspectInfo: (p: Props, outProps, noodlNode) => [{ type: 'text', value: `Is editor: ${noodlNode._internal.isEditor}` }],
} satisfies ReactNodeDef;

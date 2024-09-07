import { lazy } from 'react';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';

export type Props = BaseReactProps & { automount: boolean };

export default {
	hashTag: '#pre-release',
	module: { dynamic: lazy(() => import('../component/Transition')) },
	inputs: [
		getPortDef({ name: 'automount', displayName: 'Automount', group: 'Params', type: 'boolean', default: true }),
		getPortDef({ name: 'keepMounted', displayName: 'Keep mounted', group: 'Params', type: 'boolean', default: true }),
		getPortDef({ name: 'duration', displayName: 'Duration', group: 'Params', type: 'number', default: 250 }),
		getPortDef({ name: 'exitDelay', displayName: 'Exit delay', group: 'Params', type: 'number', default: 50 }),
		getPortDef({
			name: 'transition',
			displayName: 'Transition',
			group: 'Params',
			type: [
				{ label: 'Fade', value: 'fade' },
				{ label: 'Fade up', value: 'fade-up' },
				{ label: 'Fade down', value: 'fade-down' },
				{ label: 'Fade left', value: 'fade-left' },
				{ label: 'Fade right', value: 'fade-right' },
				{ label: 'Skew up', value: 'skew-up' },
				{ label: 'Skew down', value: 'skew-down' },
				{ label: 'Rotate left', value: 'rotate-left' },
				{ label: 'Rotate right', value: 'rotate-right' },
				{ label: 'Slide up', value: 'slide-up' },
				{ label: 'Slide down', value: 'slide-down' },
				{ label: 'Slide left', value: 'slide-left' },
				{ label: 'Slide right', value: 'slide-right' },
				{ label: 'Scale', value: 'scale' },
				{ label: 'Scale y', value: 'scale-y' },
				{ label: 'Scale x', value: 'scale-x' },
				{ label: 'Pop', value: 'pop' },
				{ label: 'Pop top-left', value: 'pop-top-left' },
				{ label: 'Pop top-right', value: 'pop-top-right' },
				{ label: 'Pop bottom-left', value: 'pop-bottom-left' },
				{ label: 'Pop bottom-right', value: 'pop-bottom-right' },
			],
			default: 'fade',
		}),
		getPortDef({ name: 'timingFunction', displayName: 'Timing function', group: 'Params', type: 'string', default: 'ease' }),
		getPortDef({ name: 'mount', displayName: 'Mount', group: 'Signals', type: 'signal' }),
		getPortDef({ name: 'unmount', displayName: 'Unmount', group: 'Signals', type: 'signal' }),
	],
	outputs: [
		getPortDef({ name: 'transitionEntered', displayName: 'Transition entered', group: 'Signals', type: 'signal' }),
		getPortDef({ name: 'transitionExited', displayName: 'Transition exited', group: 'Signals', type: 'signal' }),
	],
} satisfies ReactNodeDef;

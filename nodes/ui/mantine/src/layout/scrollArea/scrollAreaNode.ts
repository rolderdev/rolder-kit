import { reactNode } from '@packages/node';
import { getCustomEnumType, getPort, getPorts } from '@packages/port';

import v100 from '@packages/scroll-area-v1.0.0';

export default reactNode(
	'ScrollArea',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				...getPorts('input', ['customProps', 'w', 'opacity']),
				getPort({
					plug: 'input',
					name: 'scrollAreaBottomOffset',
					displayName: 'Bottom offset',
					group: 'Layout',
					type: 'number',
					default: 0,
					customs: { required: 'connection' }
				}),
				getPort({
					plug: 'input',
					name: 'offsetScrollbars',
					displayName: 'Offset scrollbars',
					group: 'Layout',
					type: 'boolean',
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'scrollToMultiplier',
					displayName: 'Scroll to multiplier',
					group: 'Params',
					type: 'number',
					default: 1,
					customs: { required: 'connection' }
				}),
				getPort({
					plug: 'input',
					name: 'scrollBehavior',
					displayName: 'Scroll behavior',
					group: 'Params',
					default: 'smooth',
					type: getCustomEnumType(['smooth', 'instant', 'auto']),
					customs: { required: 'both' }
				}),
				getPort({ plug: 'input', name: 'scroll', displayName: 'Scroll', group: 'Signals', type: 'signal' })
			]
		}
	},
	{ allowChildren: true }
);

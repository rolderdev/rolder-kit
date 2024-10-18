import { reactNode } from '@packages/node'

import v100 from '@packages/popover-dropdown-v1.0.0'

export default reactNode(
	'PopoverDropdown',
	{
		'v1.0.0': {
			module: { static: v100 },
		},
	},
	{ allowChildren: true }
)

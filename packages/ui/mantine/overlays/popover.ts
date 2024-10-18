import { reactNode } from '@shared/node-v1.0.0'

import v200 from '@nodes/popover-v2.0.0'

const popover = reactNode(
	'Popover',
	{
		'v2.0.0': v200,
	},
	{ allowChildren: true, docs: '' }
)

import pdV200 from '@nodes/popover-dropdown-v2.0.0'

const popoverDropdown = reactNode(
	'PopoverDropdown',
	{
		'v2.0.0': pdV200,
	},
	{ allowChildren: true, docs: '' }
)

import ptV200 from '@nodes/popover-target-v2.0.0'

const popoverTarget = reactNode(
	'PopoverTarget',
	{
		'v2.0.0': ptV200,
	},
	{ allowChildren: true, docs: '' }
)

export { popover, popoverDropdown, popoverTarget }

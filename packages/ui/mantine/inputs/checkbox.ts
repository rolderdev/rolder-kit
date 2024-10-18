import { reactNode } from '@shared/node-v1.0.0'

import v200 from '@nodes/checkbox-v2.0.0'

const checkbox = reactNode(
	'Checkbox',
	{
		'v2.0.0': v200,
	},
	{ docs: 'https://docs.rolder.app/#/checkbox' }
)

import cgV010 from '@nodes/checkbox-group-v0.1.0'

const checkboxGroup = reactNode(
	'CheckboxGroup',
	{
		'v0.1.0': cgV010,
	},
	{ docs: 'https://docs.rolder.app/#/checkbox', allowChildren: true }
)

import ccV010 from '@nodes/checkbox-card-v0.1.0'

const checkboxCard = reactNode(
	'CheckboxCard',
	{
		'v0.1.0': ccV010,
	},
	{ docs: 'https://docs.rolder.app/#/checkbox', allowChildren: true }
)

import ciV010 from '@nodes/checkbox-indicator-v0.1.0'

const checkboxIndicator = reactNode(
	'CheckboxIndicator',
	{
		'v0.1.0': ciV010,
	},
	{ docs: 'https://docs.rolder.app/#/checkbox' }
)

export { checkbox, checkboxGroup, checkboxCard, checkboxIndicator }

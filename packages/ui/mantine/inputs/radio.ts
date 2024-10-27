import { reactNode } from '@shared/node-v1.0.0'

import v010 from '@nodes/radio-v0.1.0'

const radio = reactNode(
	'Radio',
	{
		'v0.1.0': v010,
	},
	{ docs: 'https://docs.rolder.app/#/radio' }
)

import rgV010 from '@nodes/radio-group-v0.1.0'

const radioGroup = reactNode(
	'RadioGroup',
	{
		'v0.1.0': rgV010,
	},
	{ docs: 'https://docs.rolder.app/#/radio', allowChildren: true }
)

import rcV010 from '@nodes/radio-card-v0.1.0'

const radioCard = reactNode(
	'RadioCard',
	{
		'v0.1.0': rcV010,
	},
	{ docs: 'https://docs.rolder.app/#/radio', allowChildren: true }
)

import riV010 from '@nodes/radio-indicator-v0.1.0'

const radioIndicator = reactNode(
	'RadioIndicator',
	{
		'v0.1.0': riV010,
	},
	{ docs: 'https://docs.rolder.app/#/radio' }
)

export { radio, radioGroup, radioCard, radioIndicator }

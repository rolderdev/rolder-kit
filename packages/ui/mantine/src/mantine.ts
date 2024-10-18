import { reactNode } from '@shared/node-v1.0.0'

import { mantine } from '@nodes/mantine-v2.0.0'
import { set } from 'shared/src/libs/just'
set(window, ['R', 'libs', 'mantine'], mantine)

import v200 from '@nodes/mantine-v2.0.0'

export default reactNode(
	'Mantine',
	{
		'v2.0.0': v200,
	},
	{ allowChildren: true, docs: '' }
)

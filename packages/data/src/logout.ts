import { jsNode } from '@shared/node-v1.0.0'

import v200 from '@nodes/logout-v2.0.0'

export default jsNode(
	'logout',
	{
		'v2.0.0': v200,
	},
	{ docs: '', color: 'purple' }
)

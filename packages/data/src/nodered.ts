import { jsNode } from '@shared/node-v1.0.0';

import v200 from '@nodes/nodered-v2.0.0';

export default jsNode(
	'nodered',
	{
		'v2.0.0': v200,
	},
	{ docs: 'https://docs.rolder.app/#/nodered' }
);

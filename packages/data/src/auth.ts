import { reactNode } from '@shared/node-v1.0.0';

import v200 from '@nodes/auth-v2.0.0';

export default reactNode(
	'Auth',
	{
		'v2.0.0': v200,
	},
	{ allowChildren: true, docs: '' }
);

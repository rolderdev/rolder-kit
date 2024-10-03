import { reactNode } from '@shared/node-v1.0.0';
import { jsNode } from '@shared/node-v1.0.0';

import v200 from '@nodes/table-v2.0.0';

const table = reactNode(
	'Table',
	{
		'v2.0.0': v200,
	},
	{ docs: '' }
);

import v010 from '@nodes/table-filter-v0.1.0';

const tableFilter = jsNode(
	'tableFilter',
	{
		'v0.1.0': v010,
	},
	{ docs: '', color: 'purple' }
);

export { table, tableFilter };

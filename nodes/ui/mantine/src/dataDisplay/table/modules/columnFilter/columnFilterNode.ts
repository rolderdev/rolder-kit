import { reactNode } from '@packages/node';
import { getPorts } from '@packages/port';

import v100 from '@packages/column-filter-v1.0.0';
import v110 from '@packages/column-filter-v1.1.0';

export default reactNode(
	'ColumnFilter',
	{
		'v1.0.0': {
			hashTag: '#deprecated',
			module: { static: v100 },
			inputs: getPorts('input', [
				'table2ColumnIndex',
				'table2FilterValue',
				'table2SetFilterValue',
				'table2Filter',
				'close',
				'reset'
			]),
			outputs: getPorts('output', ['table2FilterValue'])
		},
		'v1.1.0': {
			module: { static: v110 },
			inputs: getPorts('input', [
				'table2ColumnIndex',
				'table2FilterValue',
				'table2SetFilterValue',
				'table2Filter',
				'close',
				'reset'
			]),
			outputs: getPorts('output', ['table2FilterValue'])
		}
	},
	{ allowChildren: true }
);

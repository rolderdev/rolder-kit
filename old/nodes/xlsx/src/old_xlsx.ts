import { jsNode } from '@packages/node'
import { getPort, getPorts } from '@packages/port'

const createXlsxNode = jsNode(
	'createXlsx',
	{
		'v1.0.0': {
			module: {
				dynamic: import('@packages/create-xlsx-v1.0.0'),
			},
			inputs: [
				...getPorts('input', ['items', 'fileName']),
				getPort({ plug: 'input', name: 'sheetName', displayName: 'Sheet name', group: 'Params', type: 'string' }),
				getPort({ plug: 'input', name: 'createXlsx', displayName: 'Create XLSX', group: 'Signals', type: 'signal' }),
				getPort({
					plug: 'input',
					name: 'xlsxColumns',
					displayName: 'Columns',
					group: 'Params',
					type: 'array',
					customs: { required: 'connection' },
					default: `/*[
						{
							accessor: 'content.name',
							header: 'Название',
							size: 70
						},
						{
							accessor: 'company.content.legal.name',
							header: 'Юр. лицо',
							size: 80
						}
					]*/`,
				}),
				getPort({
					plug: 'input',
					name: 'xlsxCompression',
					displayName: 'Compression',
					group: 'Params',
					type: 'boolean',
					default: true,
				}),
			],
			outputs: getPorts('output', ['creating', 'created']),
		},
		'v1.1.0': {
			module: {
				dynamic: import('@packages/create-xlsx-v1.1.0'),
			},
			inputs: [
				...getPorts('input', ['items', 'fileName']),
				getPort({ plug: 'input', name: 'sheetName', displayName: 'Sheet name', group: 'Params', type: 'string' }),
				getPort({ plug: 'input', name: 'createXlsx', displayName: 'Create XLSX', group: 'Signals', type: 'signal' }),
				getPort({
					plug: 'input',
					name: 'xlsxColumns',
					displayName: 'Columns',
					group: 'Params',
					type: 'array',
					customs: { required: 'connection' },
					default: `/*[
						{
							accessor: 'content.name',
							header: 'Название',
							size: 70
						},
						{
							accessor: 'company.content.legal.name',
							header: 'Юр. лицо',
							size: 80
						}
					]*/`,
				}),
				getPort({
					plug: 'input',
					name: 'xlsxCompression',
					displayName: 'Compression',
					group: 'Params',
					type: 'boolean',
					default: true,
				}),
			],
			outputs: getPorts('output', ['creating', 'created']),
		},
	},
	{ color: 'purple' }
)

//===================================================================
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk'

const nodes = [createXlsxNode]

Noodl.defineModule({ nodes: nodes.map((i) => defineNode(i)) })

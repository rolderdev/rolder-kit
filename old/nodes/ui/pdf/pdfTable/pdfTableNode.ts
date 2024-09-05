import { reactNode } from '@packages/node';
import { getPort, getPorts, getType } from '@packages/port';

import v100 from '@packages/pdf-table-v1.0.0';
import v110 from '@packages/pdf-table-v1.1.0';
import v120 from '@packages/pdf-table-v1.2.0';
import v130 from '@packages/pdf-table-v1.3.0';

export default reactNode(
	'PdfTable',
	{
		'v1.0.0': {
			hashTag: '#deprecated',
			module: { static: v100 },
			inputs: [
				getPort({
					plug: 'input',
					name: 'columns',
					displayName: 'Columns',
					group: 'Params',
					type: 'array',
					customs: { required: 'connection' }
				}),
				getPort({
					plug: 'input',
					name: 'wrap',
					displayName: 'Wrap',
					group: 'Params',
					type: 'boolean',
					default: true,
					customs: { required: 'connection' }
				}),
				getPort({
					plug: 'input',
					name: 'wrapChildren',
					displayName: 'Wrap children',
					group: 'Params',
					type: 'boolean',
					default: false,
					customs: { required: 'connection' }
				}),
				...getPorts('input', ['items']),
				getPort({
					plug: 'input',
					name: 'childrenAccessor',
					displayName: 'Children accessor',
					group: 'Params',
					type: 'string'
				}),
				getPort({
					plug: 'input',
					name: 'noHeader',
					displayName: 'No header',
					group: 'Params',
					type: 'boolean',
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'isChild',
					displayName: 'Is child',
					group: 'Params',
					type: getType('boolean', 'connection'),
					default: false
				})
			]
		},
		'v1.1.0': {
			hashTag: '#deprecated',
			module: { static: v110 },
			inputs: [
				getPort({
					plug: 'input',
					name: 'columns',
					displayName: 'Columns',
					group: 'Params',
					type: 'array',
					customs: { required: 'editor' }
				}),
				getPort({
					plug: 'input',
					name: 'wrap',
					displayName: 'Wrap',
					group: 'Params',
					type: 'boolean',
					default: true,
					customs: { required: 'connection' }
				}),
				getPort({
					plug: 'input',
					name: 'wrapChildren',
					displayName: 'Wrap children',
					group: 'Params',
					type: 'boolean',
					default: false,
					customs: { required: 'connection' }
				}),
				...getPorts('input', ['customProps', 'propsFunction', 'items']),
				getPort({
					plug: 'input',
					name: 'childrenAccessor',
					displayName: 'Children accessor',
					group: 'Params',
					type: 'string'
				}),
				getPort({
					plug: 'input',
					name: 'noHeader',
					displayName: 'No header',
					group: 'Params',
					type: 'boolean',
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'isChild',
					displayName: 'Is child',
					group: 'Params',
					type: getType('boolean', 'connection'),
					default: false
				})
			]
		},
		'v1.2.0': {
			hashTag: '#deprecated',
			module: { static: v120 },
			inputs: [
				getPort({
					plug: 'input',
					name: 'columns',
					displayName: 'Columns',
					group: 'Params',
					type: 'array',
					customs: { required: 'editor' }
				}),
				getPort({
					plug: 'input',
					name: 'wrap',
					displayName: 'Wrap',
					group: 'Params',
					type: 'boolean',
					default: true,
					customs: { required: 'connection' }
				}),
				getPort({
					plug: 'input',
					name: 'wrapChildren',
					displayName: 'Wrap children',
					group: 'Params',
					type: 'boolean',
					default: false,
					customs: { required: 'connection' }
				}),
				...getPorts('input', ['customProps', 'propsFunction', 'items']),
				getPort({
					plug: 'input',
					name: 'childrenAccessor',
					displayName: 'Children accessor',
					group: 'Params',
					type: 'string'
				}),
				getPort({
					plug: 'input',
					name: 'noHeader',
					displayName: 'No header',
					group: 'Params',
					type: 'boolean',
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'isChild',
					displayName: 'Is child',
					group: 'Params',
					type: getType('boolean', 'connection'),
					default: false
				})
			]
		},
		'v1.3.0': {
			module: { static: v130 },
			inputs: [
				getPort({ plug: 'input', name: 'columns', displayName: 'Columns', group: 'Columns', type: 'array' }),
				getPort({
					plug: 'input',
					name: 'useColumnsFunctions',
					displayName: 'Use functions',
					group: 'Columns',
					type: 'boolean',
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'getColumns',
					displayName: 'Get columns',
					group: 'Columns',
					type: 'array',
					customs: {
						isObject: true,
						required: 'both',
						dependsOn(p) {
							return p.useColumnsFunctions ? true : false;
						},
						validate(p) {
							if (!Object.keys(p.getColumns).includes('getHeaderColumns') && !Object.keys(p.getColumns).includes('getRowColumns'))
								return 'There is no getHeaderColumns or getRowColumns function. You should use one of them or both.';
							if (Object.keys(p.getColumns).includes('getHeaderColumns') && typeof p.getColumns.getHeaderColumns !== 'function')
								return 'getHeaderColumns is not a function';
							if (Object.keys(p.getColumns).includes('getRowColumns') && typeof p.getColumns.getRowColumns !== 'function')
								return 'getRowColumns is not a function';
							return true;
						}
					}
				}),
				getPort({
					plug: 'input',
					name: 'wrap',
					displayName: 'Wrap',
					group: 'Params',
					type: 'boolean',
					default: true,
					customs: { required: 'connection' }
				}),
				getPort({
					plug: 'input',
					name: 'wrapChildren',
					displayName: 'Wrap children',
					group: 'Params',
					type: 'boolean',
					default: false,
					customs: { required: 'connection' }
				}),
				...getPorts('input', ['customProps', 'propsFunction', 'items']),
				getPort({
					plug: 'input',
					name: 'childrenAccessor',
					displayName: 'Children accessor',
					group: 'Params',
					type: 'string'
				}),
				getPort({
					plug: 'input',
					name: 'noHeader',
					displayName: 'No header',
					group: 'Params',
					type: 'boolean',
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'isChild',
					displayName: 'Is child',
					group: 'Params',
					type: getType('boolean', 'connection'),
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'tableStyle',
					displayName: 'Table style',
					group: 'Table style',
					type: 'array',
					customs: { isObject: true }
				}),
				getPort({
					plug: 'input',
					name: 'useTableStyleFunction',
					displayName: 'Use function',
					group: 'Table style',
					type: 'boolean',
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'getTableStyle',
					displayName: 'Get table style',
					group: 'Table style',
					type: 'array',
					customs: {
						isObject: true,
						required: 'both',
						dependsOn(p) {
							return p.useTableStyleFunction ? true : false;
						},
						validate(p) {
							if (typeof Object.values(p.getTableStyle)?.[0] !== 'function')
								return 'First key of input "Get table style" is not a function';
							return true;
						}
					}
				}),
				getPort({
					plug: 'input',
					name: 'headerStyle',
					displayName: 'Header style',
					group: 'Header style',
					type: 'array',
					customs: { isObject: true }
				}),
				getPort({
					plug: 'input',
					name: 'useHeaderStyleFunction',
					displayName: 'Use function',
					group: 'Header style',
					type: 'boolean',
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'getHeaderStyle',
					displayName: 'Get header style',
					group: 'Header style',
					type: 'array',
					customs: {
						isObject: true,
						required: 'both',
						dependsOn(p) {
							return p.useHeaderStyleFunction ? true : false;
						},
						validate(p) {
							if (typeof Object.values(p.getHeaderStyle)?.[0] !== 'function')
								return 'First key of input "Get header style" is not a function';
							return true;
						}
					}
				}),
				getPort({
					plug: 'input',
					name: 'rowStyle',
					displayName: 'Row style',
					group: 'Row style',
					type: 'array',
					customs: { isObject: true }
				}),
				getPort({
					plug: 'input',
					name: 'useRowStyleFunction',
					displayName: 'Use function',
					group: 'Row style',
					type: 'boolean',
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'getRowStyle',
					displayName: 'Get row style',
					group: 'Row style',
					type: 'array',
					customs: {
						isObject: true,
						required: 'both',
						dependsOn(p) {
							return p.useRowStyleFunction ? true : false;
						},
						validate(p) {
							if (typeof Object.values(p.getRowStyle)?.[0] !== 'function')
								return 'First key of input "Get row style" is not a function';
							return true;
						}
					}
				})
			]
		}
	},
	{ allowChildren: true }
);

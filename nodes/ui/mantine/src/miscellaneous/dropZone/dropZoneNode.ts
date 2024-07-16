import { reactNode } from '@packages/node';
import { defaultUnits, getCustomEnumType, getPort, getPorts, getUnitType, inputGroups } from '@packages/port';
import { lazy } from 'react';

export default reactNode('DropZone', {
	'v1.0.0': {
		module: {
			dynamic: lazy(() => import('@packages/drop-zone-v1.0.0'))
		},
		inputs: [
			...getPorts('input', ['customProps', 'disabled', 'radius', 'w', 'h', 'loading', 'reset']),

			...inputGroups.Margins,
			...getPorts('input', ['customProps', 'propsFunction', 'size', 'label']),
			getPort({
				plug: 'input',
				name: 'dropZoneTitle',
				displayName: 'Title',
				group: 'Params',
				type: 'string',
				default: 'Внесите файл или нажмите, чтобы открыть в папке.'
			}),
			getPort({
				plug: 'input',
				name: 'acceptedType',
				displayName: 'Type of accepted file',
				group: 'Params',
				default: '*',
				type: getCustomEnumType(['*', 'pdf', 'excel', 'image']),
				customs: { required: 'both' }
			}),
			getPort({
				plug: 'input',
				name: 'acceptIconName',
				displayName: 'Accept icon name',
				group: 'Icons',
				type: 'string',
				default: 'IconDownload',
				customs: { required: 'connection' }
			}),
			getPort({
				plug: 'input',
				name: 'rejectIconName',
				displayName: 'Reject icon name',
				group: 'Icons',
				type: 'string',
				default: 'IconX',
				customs: { required: 'connection' }
			}),
			getPort({
				plug: 'input',
				name: 'idleIconName',
				displayName: 'Neutral icon name',
				group: 'Icons',
				type: 'string',
				default: 'IconFolder',
				customs: { required: 'connection' }
			}),
			getPort({
				plug: 'input',
				name: 'iconSize',
				displayName: 'Size',
				group: 'Icons',
				type: getUnitType(defaultUnits, 'px'),
				default: 24,
				customs: { required: 'both' }
			}),
			getPort({
				plug: 'input',
				name: 'stroke',
				displayName: 'Stroke',
				group: 'Icons',
				type: 'number',
				default: 2,
				customs: { required: 'both' }
			})
		],
		outputs: [
			getPort({ plug: 'output', name: 'fileName', displayName: 'fileName', group: 'Data', type: 'object' }),
			getPort({ plug: 'output', name: 'file', displayName: 'file', group: 'Data', type: 'object' }),
			getPort({ plug: 'output', name: 'loaded', displayName: 'loaded', group: 'Signals', type: 'signal' }),
			getPort({ plug: 'output', name: 'rejected', displayName: 'rejected', group: 'Signals', type: 'signal' })
		]
	},
	'v1.1.0': {
		module: {
			dynamic: lazy(() => import('@packages/drop-zone-v1.1.0'))
		},
		inputs: [
			...getPorts('input', ['customProps', 'disabled', 'radius', 'w', 'h', 'loading', 'reset']),

			...inputGroups.Margins,
			...getPorts('input', ['customProps', 'propsFunction', 'size', 'label']),
			getPort({
				plug: 'input',
				name: 'dropZoneTitle',
				displayName: 'Title',
				group: 'Params',
				type: 'string',
				default: 'Внесите файл или нажмите, чтобы открыть в папке.'
			}),
			getPort({
				plug: 'input',
				name: 'acceptedType',
				displayName: 'Type of accepted file',
				group: 'Params',
				default: '*',
				type: getCustomEnumType(['*', 'pdf', 'excel', 'image']),
				customs: { required: 'both' }
			}),
			getPort({
				plug: 'input',
				name: 'acceptIconName',
				displayName: 'Accept icon name',
				group: 'Icons',
				type: 'string',
				default: 'IconDownload',
				customs: { required: 'connection' }
			}),
			getPort({
				plug: 'input',
				name: 'rejectIconName',
				displayName: 'Reject icon name',
				group: 'Icons',
				type: 'string',
				default: 'IconX',
				customs: { required: 'connection' }
			}),
			getPort({
				plug: 'input',
				name: 'idleIconName',
				displayName: 'Neutral icon name',
				group: 'Icons',
				type: 'string',
				default: 'IconFolder',
				customs: { required: 'connection' }
			}),
			getPort({
				plug: 'input',
				name: 'iconSize',
				displayName: 'Size',
				group: 'Icons',
				type: getUnitType(defaultUnits, 'px'),
				default: 24,
				customs: { required: 'both' }
			}),
			getPort({
				plug: 'input',
				name: 'stroke',
				displayName: 'Stroke',
				group: 'Icons',
				type: 'number',
				default: 2,
				customs: { required: 'both' }
			})
		],
		outputs: [
			getPort({ plug: 'output', name: 'fileName', displayName: 'fileName', group: 'Data', type: 'object' }),
			getPort({ plug: 'output', name: 'file', displayName: 'file', group: 'Data', type: 'object' }),
			getPort({ plug: 'output', name: 'loaded', displayName: 'loaded', group: 'Signals', type: 'signal' }),
			getPort({ plug: 'output', name: 'rejected', displayName: 'rejected', group: 'Signals', type: 'signal' })
		]
	},
	'v1.1.1': {
		module: {
			dynamic: lazy(() => import('@packages/drop-zone-v1.1.1'))
		},
		inputs: [
			...getPorts('input', ['customProps', 'disabled', 'radius', 'w', 'h', 'loading', 'reset']),

			...inputGroups.Margins,
			...getPorts('input', ['customProps', 'propsFunction', 'size', 'label']),
			getPort({
				plug: 'input',
				name: 'dropZoneTitle',
				displayName: 'Title',
				group: 'Params',
				type: 'string',
				default: 'Внесите файл или нажмите, чтобы открыть в папке.'
			}),
			getPort({
				plug: 'input',
				name: 'acceptedType',
				displayName: 'Type of accepted file',
				group: 'Params',
				default: '*',
				type: getCustomEnumType(['*', 'pdf', 'excel', 'image']),
				customs: { required: 'both' }
			}),
			getPort({
				plug: 'input',
				name: 'acceptIconName',
				displayName: 'Accept icon name',
				group: 'Icons',
				type: 'string',
				default: 'IconDownload',
				customs: { required: 'connection' }
			}),
			getPort({
				plug: 'input',
				name: 'rejectIconName',
				displayName: 'Reject icon name',
				group: 'Icons',
				type: 'string',
				default: 'IconX',
				customs: { required: 'connection' }
			}),
			getPort({
				plug: 'input',
				name: 'idleIconName',
				displayName: 'Neutral icon name',
				group: 'Icons',
				type: 'string',
				default: 'IconFolder',
				customs: { required: 'connection' }
			}),
			getPort({
				plug: 'input',
				name: 'iconSize',
				displayName: 'Size',
				group: 'Icons',
				type: getUnitType(defaultUnits, 'px'),
				default: 24,
				customs: { required: 'both' }
			}),
			getPort({
				plug: 'input',
				name: 'stroke',
				displayName: 'Stroke',
				group: 'Icons',
				type: 'number',
				default: 2,
				customs: { required: 'both' }
			})
		],
		outputs: [
			getPort({ plug: 'output', name: 'fileName', displayName: 'fileName', group: 'Data', type: 'object' }),
			getPort({ plug: 'output', name: 'file', displayName: 'file', group: 'Data', type: 'object' }),
			getPort({ plug: 'output', name: 'loaded', displayName: 'loaded', group: 'Signals', type: 'signal' }),
			getPort({ plug: 'output', name: 'rejected', displayName: 'rejected', group: 'Signals', type: 'signal' })
		]
	}
});

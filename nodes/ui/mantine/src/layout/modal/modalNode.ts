import { reactNode } from '@packages/node';
import { defaultUnits, enums, getEnumType, getPort, getPorts, getUnitType } from '@packages/port';

import v100 from '@packages/modal-v1.0.0';

export default reactNode(
	'Modal',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				...getPorts('input', ['customProps', 'open', 'close']),
				getPort({
					plug: 'input',
					name: 'sizePresets',
					displayName: 'Size',
					group: 'Dimensions',
					default: 'sm',
					type: getEnumType(enums.sizes)
				}),
				getPort({
					plug: 'input',
					name: 'sizeUnits',
					displayName: 'Size (units)',
					group: 'Dimensions',
					type: getUnitType(defaultUnits, 'rem')
				}),
				getPort({
					plug: 'input',
					name: 'modalHeaderEnabled',
					displayName: 'Header',
					group: 'Params',
					default: false,
					type: 'boolean'
				}),
				getPort({
					plug: 'input',
					name: 'modalTitle',
					displayName: 'Modal title',
					group: 'Params',
					type: 'string',
					customs: {
						dependsOn(p) {
							return p.modalHeaderEnabled ? true : false;
						}
					}
				}),
				getPort({
					plug: 'input',
					name: 'closeActionEnabled',
					displayName: 'Enable close action',
					group: 'Params',
					default: false,
					type: 'boolean',
					customs: {
						dependsOn(p) {
							return p.modalHeaderEnabled ? true : false;
						}
					}
				}),
				getPort({ plug: 'input', name: 'modalOpacity', displayName: 'Opacity', group: 'Style', default: 0.6, type: 'number' }),
				getPort({ plug: 'input', name: 'modalBlur', displayName: 'Blur', group: 'Style', default: 2, type: 'number' }),
				getPort({
					plug: 'input',
					name: 'modalTitleOrder',
					displayName: 'Order',
					group: 'Font',
					default: 4,
					type: 'number',
					customs: {
						dependsOn(p) {
							return p.modalHeaderEnabled ? true : false;
						}
					}
				}),
				getPort({
					plug: 'input',
					name: 'fullScreen',
					displayName: 'Fullscreen',
					group: 'Layout',
					default: false,
					type: 'boolean'
				}),
				getPort({ plug: 'input', name: 'trapFocus', displayName: 'Trap focus', group: 'Params', default: true, type: 'boolean' }),
				getPort({
					plug: 'input',
					name: 'returnFocus',
					displayName: 'Return focus',
					group: 'Params',
					default: true,
					type: 'boolean'
				}),
				getPort({
					plug: 'input',
					name: 'closeOnEscape',
					displayName: 'Close on escape',
					group: 'Params',
					default: false,
					type: 'boolean'
				}),
				getPort({
					plug: 'input',
					name: 'closeOnClickOutside',
					displayName: 'Close on click outside',
					group: 'Params',
					default: false,
					type: 'boolean'
				})
			],
			outputs: getPorts('output', ['closed'])
		}
	},
	{ allowChildren: true }
);

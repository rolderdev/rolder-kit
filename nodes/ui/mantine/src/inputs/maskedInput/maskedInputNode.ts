import { reactNode } from '@packages/node';
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port';

import v100 from '@packages/masked-input-v1.0.0';

export default reactNode('MaskedInput', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'label',
				'placeholder',
				'disabled',
				'withAsterisk',
				'w',
				'inputError',
				'reset',
				'focusRightSection',
				'debouncedTyping',
				'typingDelay'
			]),
			...inputGroups.Form,
			...inputGroups.Icon,
			getPort({
				plug: 'input',
				name: 'scope',
				displayName: 'Scope',
				group: 'Scope',
				type: getCustomEnumType(['form']),
				default: 'form',
				customs: {
					required: 'connection',
					dependsOn(p) {
						return p.useScope ? true : false;
					}
				}
			}),
			getPort({
				plug: 'input',
				name: 'inputValue',
				displayName: 'Value',
				group: 'Data',
				type: '*',
				customs: {
					dependsOn(p) {
						return p.useScope ? false : true;
					}
				}
			}),
			getPort({
				plug: 'input',
				name: 'maskType',
				displayName: 'Type',
				group: 'Mask params',
				default: 'pattern',
				type: getCustomEnumType(['number', 'pattern']),
				customs: { required: 'connection' }
			}),
			getPort({
				plug: 'input',
				name: 'maskPattern',
				displayName: 'Pattern',
				group: 'Mask params',
				default: '{8} (000) 000-00-00',
				type: 'string',
				customs: {
					required: 'both',
					dependsOn(p) {
						return p.maskType === 'pattern';
					}
				}
			}),
			getPort({
				plug: 'input',
				name: 'hideMaskPattern',
				displayName: 'Hide',
				group: 'Mask params',
				default: false,
				type: 'boolean',
				customs: {
					required: 'connection',
					dependsOn(p) {
						return p.maskType === 'pattern';
					}
				}
			}),
			getPort({
				plug: 'input',
				name: 'overwriteMaskPattern',
				displayName: 'Overwrite',
				group: 'Mask params',
				default: true,
				type: 'boolean',
				customs: {
					required: 'connection',
					dependsOn(p) {
						return p.maskType === 'pattern';
					}
				}
			}),
			getPort({
				plug: 'input',
				name: 'thousandsSeparator',
				displayName: 'Thousands separator',
				group: 'Mask params',
				default: ' ',
				type: 'string',
				customs: {
					dependsOn(p) {
						return p.maskType === 'number';
					}
				}
			}),
			getPort({
				plug: 'input',
				name: 'radix',
				displayName: 'Radix',
				group: 'Mask params',
				default: '.',
				type: 'string',
				customs: {
					dependsOn(p) {
						return p.maskType === 'number';
					}
				}
			}),
			getPort({
				plug: 'input',
				name: 'numberScale',
				displayName: 'Scale',
				group: 'Mask params',
				default: 2,
				type: 'number',
				customs: {
					required: 'both',
					dependsOn(p) {
						return p.maskType === 'number';
					}
				}
			})
		],
		outputs: getPorts('output', ['typedValue', 'reseted'])
	}
});

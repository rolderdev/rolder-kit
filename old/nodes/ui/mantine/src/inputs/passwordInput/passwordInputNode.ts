import { reactNode } from '@packages/node';
import { getCustomEnumType, getMantinePort, getPort, getPorts, inputGroups } from '@packages/port';

import v100 from '@packages/password-input-v1.0.0';

export default reactNode('PasswordInput', {
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
				'focusRightSection'
			]),
			...inputGroups.Form,
			getMantinePort('radius', { comp: 'PasswordInput', prop: 'radius' }),
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
			})
		],
		outputs: getPorts('output', ['typedValue', 'reseted'])
	}
});

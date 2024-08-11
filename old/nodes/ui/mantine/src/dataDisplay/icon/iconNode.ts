import { reactNode } from '@packages/node';
import { getPorts, getPort, getCustomEnumType } from '@packages/port';

import v100 from '@packages/icon-v1.0.0';

export default reactNode('Icon', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'iconType',
				'iconName',
				'iconSize',
				'iconStroke',
				'iconColor',
				'themeIconVariant',
				'themeIconSize',
				'themeIconRadius',
				'themeIconColor',
				'themeIconGradient'
			]),
			getPort({
				plug: 'input',
				name: 'scope',
				displayName: 'Scope',
				group: 'Scope',
				type: getCustomEnumType(['table']),
				default: 'table',
				customs: {
					required: 'connection',
					dependsOn(props) {
						return props.useScope ? true : false;
					}
				}
			})
		]
	}
});

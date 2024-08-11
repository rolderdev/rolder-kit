import { reactNode } from '@packages/node';
import { getPorts, getPort, getUnitType, defaultUnits } from '@packages/port';

import v100 from '@packages/bar-loader-v1.0.0';

export default reactNode('BarLoader', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', ['customProps', 'loading']),
			getPort({ plug: 'input', name: 'loaderColor', displayName: 'Color', group: 'Params', type: 'string' }),
			getPort({
				plug: 'input',
				name: 'barLoaderWidth',
				displayName: 'Width',
				group: 'Params',
				default: '100%',
				type: getUnitType(defaultUnits, '%')
			}),
			getPort({ plug: 'input', name: 'zIndex', displayName: 'ZIndex', group: 'Params', type: 'number', default: 2 })
		]
	}
});

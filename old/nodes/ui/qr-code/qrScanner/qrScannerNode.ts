import { reactNode } from '@packages/node'
import { getPort, getPorts } from '@packages/port'
import { lazy } from 'react'

export default reactNode('QRScanner', {
	'v1.0.0': {
		module: {
			dynamic: lazy(() => import('@packages/qr-scanner-v1.0.0')),
		},
		inputs: [
			...getPorts('input', ['customProps']),
			getPort({
				plug: 'input',
				name: 'maxScansPerSecond',
				displayName: 'Max scans per second',
				group: 'Params',
				type: 'number',
				default: 25,
				customs: { required: 'both' },
			}),
		],
		outputs: [
			getPort({ plug: 'output', name: 'qrScanned', displayName: 'Scanned', group: 'Signals', type: 'signal' }),
			getPort({ plug: 'output', name: 'qrString', displayName: 'QR string', group: 'Data', type: 'string' }),
		],
	},
})

import { jsNode } from '@packages/node'
import { getEnumType, getPort } from '@packages/port'

const qrLevels = [
	{ value: 'L', label: 'Lowest' },
	{ value: 'M', label: 'Medium' },
	{ value: 'Q', label: 'Quality' },
	{ value: 'H', label: 'Highest' },
]

export default jsNode(
	'getQrCode',
	{
		'v1.0.0': {
			module: {
				dynamic: import('@packages/get-qr-code-v1.0.0'),
			},
			inputs: [
				getPort({
					plug: 'input',
					name: 'qrString',
					displayName: 'QR string',
					group: 'Data',
					type: 'string',
					customs: { required: 'connection' },
				}),
				getPort({
					plug: 'input',
					name: 'qrCodeLevel2',
					displayName: 'QR string',
					group: 'Params',
					type: getEnumType(qrLevels),
					default: 'M',
					customs: { required: 'connection' },
				}),
				getPort({ plug: 'input', name: 'getQrCode', displayName: 'Get QR code', group: 'Signals', type: 'signal' }),
			],
			outputs: [getPort({ plug: 'output', name: 'qrDataUrl', displayName: 'QR data URL', group: 'Data', type: '*' })],
		},
	},
	{ color: 'purple' }
)

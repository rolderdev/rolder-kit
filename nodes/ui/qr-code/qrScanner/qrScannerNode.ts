import { reactNode } from '@packages/node'
import { getPorts, getPort } from '@packages/port'
import { lazy } from 'react'

const qrLevels = [
    { value: 'L', label: 'Lowest' }, { value: 'M', label: 'Medium' }, { value: 'Q', label: 'Quality' }, { value: 'H', label: 'Highest' }
]

export default reactNode('QRScanner', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/qr-scanner-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', ['customProps']),
            getPort({
                plug: 'input', name: 'maxScansPerSecond', displayName: 'Max scans per second', group: 'Params', type: 'number',
                default: 25, customs: { required: 'both' }
            })
        ],
        outputs: [
            getPort({ plug: 'output', name: 'qrScanned', displayName: 'Scanned', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'output', name: 'qrString', displayName: 'QR string', group: 'Data', type: 'string' })
        ]
    }
})
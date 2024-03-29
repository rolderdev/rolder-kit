import { reactNode } from '@shared/node'
import { getPorts, getPort, getCustomEnumType, getUnitType, defaultUnits, getMantinePort, getEnumType } from '@shared/port'
import { lazy } from 'react'

const qrLevels = [
    { value: 'L', label: 'Lowest' }, { value: 'M', label: 'Medium' }, { value: 'Q', label: 'Quality' }, { value: 'H', label: 'Highest' }
]

export default reactNode('QRCode', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/qr-code-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', ['customProps', 'propsFunction', 'useScope']),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope', type: getCustomEnumType(['table']),
                default: 'table', customs: {
                    required: 'connection',
                    dependsOn(props) { return props.useScope ? true : false }
                }
            }),
            getPort({ plug: 'input', name: 'value', displayName: 'Value', group: 'Data', type: 'string', customs: { required: 'connection' } }),
            getPort({
                plug: 'input', name: 'size', displayName: 'Size', group: 'Dimensions', type: 'number', default: 64,
                customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'qrCodeLevel', displayName: 'QR string', group: 'Params', type: getEnumType(qrLevels),
                default: 'M', customs: { required: 'connection' }
            }),
        ]
    }
})
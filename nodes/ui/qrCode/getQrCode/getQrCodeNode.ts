import { jsNode } from '@shared/node'
import { getEnumType, getPort } from '@shared/port'

const qrLevels = [
    { value: 'L', label: 'Lowest' }, { value: 'M', label: 'Medium' }, { value: 'Q', label: 'Quality' }, { value: 'H', label: 'Highest' }
]

export default jsNode('getQrCode', 'qrCode', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/get-qr-code-v1.0.0'),
            remote: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                `remote/ui/qr-code/get-qr-code-v1.0.0`),
        },
        inputs: [
            getPort({
                plug: 'input', name: 'qrString', displayName: 'QR string', group: 'Data', type: 'string', customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'qrCodeLevel2', displayName: 'QR string', group: 'Params', type: getEnumType(qrLevels),
                default: 'M', customs: { required: 'connection' }
            }),
            getPort({ plug: 'input', name: 'getQrCode', displayName: 'Get QR code', group: 'Signals', type: 'signal' }),
        ],
        outputs: [getPort({ plug: 'output', name: 'qrDataUrl', displayName: 'QR data URL', group: 'Data', type: '*' })]
    }
}, { moduleName: 'qr-code', color: 'purple' })
import { JsVersions, jsNode } from '@rk/node-fabrik'
import { getCustomEnumType, getPort } from '@rk/port-fabrik'

export const qrQualityEnum = [
    { value: 'L', label: 'Lowest' }, { value: 'M', label: 'Medium' }, { value: 'Q', label: 'Quality' }, { value: 'H', label: 'Highest' }
] as const satisfies readonly { value: string, label: string }[]

const jsVersions: JsVersions = {
    'v0.1.0': {
        module: import('./v0.1.0/getQrCode'),
        inputs: [
            getPort('getQrCode', 'Get QR-code', 'Signals', 'signal', 'input'),
            getPort('qrString', 'QR string', 'Params', 'string', 'input', { required: 'editor' }),
            getPort('qrQuality', 'QR quality', 'Params', getCustomEnumType(qrQualityEnum), 'input', { required: 'connection' }, 'M')
        ],
        outputs: [getPort('qrDataUrl', 'QR dataURL', 'Data', '*', 'output')],        
    }
}

export default jsNode('getQrCode', jsVersions, { color: 'purple' })

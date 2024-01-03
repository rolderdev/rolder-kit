import { NoodlNode, sendOutput } from '@rk/node-fabrik'
import QRCode from 'qrcode'
import { CompProps } from './types'

export default {
    signals: {
        getQrCode: (noodlNode: NoodlNode, props: CompProps) => {
            const { qrString, qrQuality } = props
            console.log('getQrCode', props)
            QRCode.toDataURL(qrString, { errorCorrectionLevel: qrQuality })
                .then(url => sendOutput(noodlNode, 'qrDataUrl', url))
                .catch(err => console.error(err))
        }
    }
}
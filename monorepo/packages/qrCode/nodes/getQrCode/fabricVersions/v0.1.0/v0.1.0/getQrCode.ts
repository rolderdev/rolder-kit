import { sendOutput } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import QRCode from 'qrcode'

export default {
    signals: {
        getQrCode: (noodlNode: NoodlNode) => {
            const { qrString, qrCodeLevel2 } = noodlNode.resultProps

            QRCode.toDataURL(qrString, { errorCorrectionLevel: qrCodeLevel2 })
                .then(url => sendOutput(noodlNode, 'qrDataUrl', url))
                .catch(err => console.error(err))
        }
    }
}
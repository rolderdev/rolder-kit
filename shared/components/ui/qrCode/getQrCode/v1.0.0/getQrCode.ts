import QRCode from 'qrcode'
import { Props } from './types';
import { sendOutput } from '@shared/port-send';

export default {
  async getQrCode(props: Props) {
    const { qrString, qrCodeLevel2 } = props

    QRCode.toDataURL(qrString, { errorCorrectionLevel: qrCodeLevel2 })
      //@ts-ignore    
      .then(url => sendOutput(props.noodlNode, 'qrDataUrl', url))
      .catch(err => log.error('getQrCode error', err))
  }
}
import { sendOutput } from '@packages/port-send'
import QRCode from 'qrcode'
import type { Props } from './types'

export default {
	async getQrCode(props: Props) {
		const { qrString, qrCodeLevel2 } = props

		QRCode.toDataURL(qrString, { errorCorrectionLevel: qrCodeLevel2 })
			//@ts-ignore
			.then((url) => sendOutput(props.noodlNode, 'qrDataUrl', url))
			.catch((err) => log.error('getQrCode error', err))
	},
}

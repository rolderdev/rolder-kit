import type { BaseJsProps } from '@packages/node'
import type { QRCodeErrorCorrectionLevel } from 'qrcode'

export type Props = BaseJsProps & {
	qrString: string
	qrCodeLevel2: QRCodeErrorCorrectionLevel
}

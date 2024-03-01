import { BaseJsProps } from '@shared/node'
import { QRCodeErrorCorrectionLevel } from 'qrcode'

export type Props = BaseJsProps & {
    qrString: string
    qrCodeLevel2: QRCodeErrorCorrectionLevel
}
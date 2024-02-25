import ReactPDF = require('@react-pdf/renderer')
import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
    orientation: 'portrait' | 'landscape'
    wrap: boolean
}
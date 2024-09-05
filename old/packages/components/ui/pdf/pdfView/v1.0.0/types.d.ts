import ReactPDF = require('@react-pdf/renderer')
import { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
    wrap: boolean
    fixed: boolean
}
import ReactPDF = require('@react-pdf/renderer')
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	orientation: 'portrait' | 'landscape'
	wrap: boolean
}

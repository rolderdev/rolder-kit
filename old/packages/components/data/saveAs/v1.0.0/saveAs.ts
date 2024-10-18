import { saveAs } from 'file-saver'
import type { Props } from './types'

export default {
	saveAs(props: Props) {
		const { blob, fileName } = props
		if (blob) saveAs(blob, fileName || 'file.pdf')
	},
}

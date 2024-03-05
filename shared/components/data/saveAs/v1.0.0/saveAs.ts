import { saveAs } from "file-saver"
import { Props } from './types'

export default {
  logout(props: Props) {
    const { blob, fileName } = props
    if (blob) saveAs(blob, fileName || 'file.pdf',)
  }
}
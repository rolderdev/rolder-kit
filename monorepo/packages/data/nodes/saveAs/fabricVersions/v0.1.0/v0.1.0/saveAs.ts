import { saveAs } from "file-saver"

export default {
  signals: {
    saveAs: (noodlNode: NoodlNode) => {
      const { blob, fileName2 } = noodlNode.resultProps
      if (blob) saveAs(blob, fileName2 || 'file.pdf',)
    }
  }
}
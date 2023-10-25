import { utils, writeFile } from "xlsx"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

type XlsxColumn = {
  accessor: string
  header: string
  size: number
  dataType: string
  dataFormat: any
  defaultValue: any
}

export default {
  signals: {
    createXlsx: (noodlNode: NoodlNode) => {
      const { getFormatedDate, getMasked, getValue } = window.R.utils
      const { numbro } = window.R.libs
      const { xlsxColumns, items, fileName, xlsxCompression, sheetName } = noodlNode.resultProps


      sendOutput(noodlNode, 'creating', true)

      function accessorFn(columnDef: XlsxColumn, item: RItem) {
        switch (columnDef.dataType) {
          case 'date': return getFormatedDate.v2(item, columnDef.accessor, columnDef.dataFormat)
          case 'mask': return getMasked.v2(getValue.v8(item, columnDef.accessor, columnDef.defaultValue), columnDef.dataFormat)
          case 'number': return numbro(getValue.v8(item, columnDef.accessor, columnDef.defaultValue) || 0).format(columnDef.dataFormat)
          default: return getValue.v8(item, columnDef.accessor, columnDef.defaultValue)
        }
      }

      const xlsxData = items.map((item: RItem) => {
        let xlsxItem: { [x: string]: any } = {}
        xlsxColumns.map((columnDef: XlsxColumn) => {
          xlsxItem[columnDef.header] = accessorFn(columnDef, item)
        })
        return xlsxItem
      })

      const ws = utils.json_to_sheet(xlsxData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, sheetName);
      ws["!cols"] = xlsxColumns.map((columnDef: XlsxColumn) => ({ wch: columnDef.size }))
      writeFile(wb, fileName, { compression: xlsxCompression })

      sendOutput(noodlNode, 'creating', false)
      sendSignal(noodlNode, 'created')
    }
  }
}
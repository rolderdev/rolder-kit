import { NodeInstance } from "../../../../main/getNodes/v0.5.0/types"
import { utils, writeFile } from 'xlsx'
import { getDate, getMasked } from "../../../../utils/data/v0.3.0/data"
import getValue from "../../../../utils/data/getValue/v0.5.0/getValue"
import numbro from "numbro"
import { sendOutput, sendSignal } from "../../../../main/ports/send/v0.3.0/send"

type XlsxColumn = {
  accessor: string
  header: string
  size: number
  dataType: string
  dataFormat: any
  defaultValue: any
}

const signals = {
  createXlsx: (node: NodeInstance) => {
    const { xlsxColumns, items, fileName, xlsxCompression, sheetName }: {
      xlsxColumns: XlsxColumn[], items: any[], fileName: string, xlsxCompression: boolean, sheetName: string
    } = node.resultInputs
    sendOutput(node, 'creating', true)

    function accessorFn(columnDef: XlsxColumn, item: any) {
      switch (columnDef.dataType) {
        case 'date': {
          const date = getDate(item, columnDef.accessor, columnDef.dataFormat)
          if (date === 'Invalid Date') return ''
          else return date
        }
        case 'mask': return getMasked(getValue(item, columnDef.accessor, columnDef.defaultValue), columnDef.dataFormat)
        case 'number': return numbro(getValue(item, columnDef.accessor, columnDef.defaultValue) || 0).format(columnDef.dataFormat)
        default: return getValue(item, columnDef.accessor, columnDef.defaultValue)
      }
    }

    const xlsxData = items.map(item => {
      let xlsxItem: { [x: string]: any } = {}
      xlsxColumns.map(columnDef => {
        xlsxItem[columnDef.header] = accessorFn(columnDef, item)
      })
      return xlsxItem
    })

    const ws = utils.json_to_sheet(xlsxData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, sheetName);
    ws["!cols"] = xlsxColumns.map(columnDef => ({ wch: columnDef.size }))
    writeFile(wb, fileName, { compression: xlsxCompression })

    sendOutput(node, 'creating', false)
    sendSignal(node, 'created')
  }
}

export default signals
import type { Item } from 'types';
import { Props, XlsxColumn } from './types';
import { sendOutput, sendSignal } from '@packages/port-send';
import getFormatedDate from '@packages/get-formated-date'
import getMasked from '@packages/get-masked';
import getValue from '@packages/get-value';
import { utils, writeFile } from "xlsx"

export default {
  async createXlsx(props: Props) {
    const { numbro } = window.R.libs
    const { noodlNode, xlsxColumns, items, fileName, xlsxCompression, sheetName } = props

    const startTime = log.start()

    sendOutput(noodlNode, 'creating', true)

    function accessorFn(columnDef: XlsxColumn, item: Item) {
      switch (columnDef.dataType) {
        case 'date': return getFormatedDate(item, columnDef.accessor, columnDef.dataFormat)
        case 'mask': return getMasked(getValue(item, columnDef.accessor, columnDef.defaultValue), columnDef.dataFormat)
        case 'number': return numbro(getValue(item, columnDef.accessor, columnDef.defaultValue) || 0).format(columnDef.dataFormat)
        default: return getValue(item, columnDef.accessor, columnDef.defaultValue)
      }
    }

    const xlsxData = items?.map(item => {
      let xlsxItem: { [x: string]: any } = {}
      xlsxColumns.map((columnDef: XlsxColumn) => {
        xlsxItem[columnDef.header] = accessorFn(columnDef, item)
      })
      return xlsxItem
    })

    if (xlsxData && fileName) {
      const ws = utils.json_to_sheet(xlsxData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, sheetName);
      ws["!cols"] = xlsxColumns.map((columnDef: XlsxColumn) => ({ wch: columnDef.size }))
      writeFile(wb, fileName, { compression: xlsxCompression })

      sendOutput(noodlNode, 'creating', false)
      sendSignal(noodlNode, 'created')
    }

    log.end(`createXlsx`, startTime)
  }
}
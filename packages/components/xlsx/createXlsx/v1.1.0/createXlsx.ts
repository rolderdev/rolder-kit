import type { Item } from 'types';
import type { Props, XlsxColumn } from './types';
import { sendOutput, sendSignal } from '@packages/port-send';
import getFormatedDate from '@packages/get-formated-date'
import getMasked from '@packages/get-masked';
import getValue from '@packages/get-value';
import { utils, writeFile } from "xlsx"
import "sheetjs-style-v2"

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
      // Создаем книгу
      const wb = utils.book_new();
      // Создаем страницу из json файла
      const ws = utils.json_to_sheet(xlsxData);
      // Устанавливаем ширину колонок
      ws["!cols"] = xlsxColumns.map((columnDef: XlsxColumn) => ({wch: columnDef.size}))

      //   {
      //     wch: columnDef.size,
      //     // s: {
      //     //   alignment: {
      //     //     vertical: "center",
      //     //     horizontal: "center",
      //     //     wrapText: true
      //     //   }
      //     // },
      //     // hta: 'center'
      //   }
      // ))

      // Создаем стиль для выравнивания по центру и переноса текста на новую строку
      const style = {
        alignment: {
          wrapText: true,
          vertical: "center",
          horizontal: "center"
        }
      };

      // Применяем стиль к диапазону ячеек
      ws['A5'].s = style;
      ws['A7'].s = style;
      ws['B5'].s = style;
      ws['B7'].s = style;

      // Добавляем отредактированную и наполненную страницу в excel книгу
      utils.book_append_sheet(wb, ws, sheetName);
      console.log("ws", ws)
      
      // Создаем на её основе excel файл
      writeFile(wb, fileName, { compression: xlsxCompression })

      sendOutput(noodlNode, 'creating', false)
      sendSignal(noodlNode, 'created')
    }

    log.end(`createXlsx`, startTime)
  }
}
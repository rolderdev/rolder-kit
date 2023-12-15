import { MantineTheme, Text, useMantineTheme, Box, Avatar } from '@mantine/core'
import { useShallowEffect } from '@mantine/hooks'
import { DataTable } from 'mantine-datatable'
import { getValue } from '../../../../utils/data/v0.2.0/data'
import { useState } from 'react'
import Dayjs from 'dayjs'

export default function Table_v0_3_0(props: any) {
  const {
    tableData, loading, singleRowSelectable, highlightSelectedRow, selectFirstItem, resetSingleSelected, resetMultipleSelected,
    multipleRowSelectable
  } = props
  let { columns } = props

  const [selectedId, setSelectedId] = useState('')
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  // defaults
  useShallowEffect(() => {
    setSelectedId(selectFirstItem ? tableData[0]?.id : '')
    props.selectedItem(selectFirstItem ? tableData[0] : undefined)
  }, [tableData])

  // reset
  useShallowEffect(() => {
    if (resetSingleSelected) {
      setSelectedId('')
      props.selectedItem(null)
    }
  }, [resetSingleSelected])
  useShallowEffect(() => {
    if (resetMultipleSelected) {
      setSelectedItems([])
      props.selectedItems([])
    }
  }, [resetMultipleSelected])

  const theme = useMantineTheme()

  useShallowEffect(() => {
    if (columns) {
      columns.forEach((c: any) => {
        function formatValue(record: any) {
          switch (c.dataType) {
            case 'date': return Dayjs(getValue(record, c.accessor)).locale('ru').format(c.dateFormat)
            default: return getValue(record, c.accessor)
          }
        }
        switch (c.columnRender) {
          case 'avatar':
            c.render = (record: any) => formatValue(record)
              ? <Avatar m={-6} color="red.4" variant="filled" radius="xl" >{formatValue(record)}</Avatar> : <></>
            break
          case 'cycle':
            c.render = (record: any) => formatValue(record) ? <Box
              sx={(theme: MantineTheme) => ({
                height: 16,
                width: 16,
                borderRadius: 8,
                backgroundColor: theme.colors[c.colorMap[formatValue(record) || 'dark']][6],
              })} /> : <></>
            break
          default: c.render = (record: any) => <Text
            sx={c.props?.respectLineBreak && { whiteSpace: 'pre-line' }}
          >
            {formatValue(record)}

          </Text>
        }
      })
    }
  }, [columns])

  return (
    <DataTable
      columns={columns}
      records={tableData}
      fetching={loading}
      loaderVariant='dots'
      noRecordsText={null}
      sx={{ background: 'white', width: props.widthString, height: props.heightString }}
      onRowClick={singleRowSelectable && ((data: any) => {
        setSelectedId(data.id)
        props.selectedItem(data)
        props.selected()
      })}
      selectedRecords={multipleRowSelectable ? selectedItems : undefined}
      onSelectedRecordsChange={(items) => {
        props.selectedItems(items)
        setSelectedItems(items)
      }}
      rowStyle={({ id }) => (
        singleRowSelectable && selectedId === id && highlightSelectedRow
          ? { backgroundColor: theme.colors.red[3] }
          : undefined
      )}
      {...props}
    />
  )
}
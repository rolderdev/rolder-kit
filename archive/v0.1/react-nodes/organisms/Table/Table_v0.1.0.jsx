import { Text, Avatar, Box, useMantineTheme } from '@mantine/core'
import { useShallowEffect } from '@mantine/hooks'
import { DataTable } from 'mantine-datatable'
import { getValue } from '../../../utils/data/v.0.1.0/data'
import { useState } from 'react'

export default function Table_v0_1_0(props) {
  const { className, tableData, columns, isLoading, selectable, selectableType, highlightSelectedRow } = props

  const [selectedId, setSelectedId] = useState('')
  const enableOnRowClick = selectable === true && selectableType === 'singleRow'

  // defaults
  useShallowEffect(() => {
    setSelectedId(tableData?.[className]?.[0]?.id)
    props.selectedItem(tableData?.[className]?.[0])
  }, [className])

  const theme = useMantineTheme()

  const ColumnRender = (row, _, accessor) => {
    const columnProps = columns.find(c => c.accessor === accessor)
    const dataType = columnProps.dataType
    const fieldFormat = columnProps.fieldFormat || accessor
    let value = getValue(row, fieldFormat)

    switch (dataType) {
      case 'date': value = dayjs(value).format(columnProps.dateFormat); break
    }
    const columnRender = columnProps.columnRender

    switch (columnRender) {
      case 'avatar':
        return value ? <Avatar m={-6} color="red.4" variant="filled" radius="xl" >{value}</Avatar> : <></>
      case 'cycle':
        return value ? <Box
          sx={(theme) => ({
            height: 16,
            width: 16,
            borderRadius: 8,
            backgroundColor: theme.colors[columnProps.dataMap[value]][6],
          })} /> : <></>
      default: return <Text >{value}</Text>
    }
  }

  return (
    <DataTable
      columns={columns}
      records={tableData?.[className] || []}
      fetching={isLoading}
      loaderVariant='dots'
      noRecordsText={null}
      defaultColumnRender={ColumnRender}
      sx={{ background: 'white', width: props.widthString, height: props.heightString }}
      onRowClick={enableOnRowClick && ((data) => {
        setSelectedId(data.id)
        props.selectedItem(data)
        props.sendSelected()
      })}
      rowStyle={({ id }) => (
        enableOnRowClick && selectedId === id && highlightSelectedRow
          ? { backgroundColor: theme.colors.red[3] }
          : undefined
      )}
      {...props}
    />
  )
}
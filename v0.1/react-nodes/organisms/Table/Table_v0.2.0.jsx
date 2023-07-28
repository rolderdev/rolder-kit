import { Text, Avatar, Box, useMantineTheme, CloseButton, Group } from '@mantine/core'
import { useShallowEffect } from '@mantine/hooks'
import { DataTable } from 'mantine-datatable'
import { getValue } from '../../../utils/data/v.0.1.0/data'
import { useState } from 'react'
import Icons from '../../../libs/icons/Icons_v0.1.0'

export default function Table_v0_2_0(props) {
  const { tableData, columns, isLoading, selectable, selectableType, highlightSelectedRow, selectFirstItem, resetSelected } = props
  const [selectedId, setSelectedId] = useState('')
  const enableOnRowClick = selectable === true && selectableType === 'singleRow'

  // defaults
  useShallowEffect(() => {
    setSelectedId(selectFirstItem ? tableData[0]?.id : '')
    props.selectedItem(selectFirstItem ? tableData[0]?.id : '')
  }, [tableData])

  // reset
  useShallowEffect(() => {
    if (resetSelected) {
      setSelectedId('')
      props.selectedItem('')
    }
  }, [resetSelected])

  const theme = useMantineTheme()

  useShallowEffect(() => {
    if (columns) {
      columns.forEach(c => {
        switch (c.columnRender) {
          /* case 'actions': c.render = (record) => (
            <Group spacing={4} position="right" noWrap>
              {c.actions.map(a => {
                switch (a.type) {
                  case 'closeButton':
                    return <CloseButton onClick={() => props.doDelete()} {...a.props} />
                }
              })}
            </Group>)
            break */
          default: c.render = (record) => <Text
            sx={c.props?.respectLineBreak && { whiteSpace: 'pre-line' }}
          >
            {getValue(record, c.accessor)}
          </Text>
        }
      })
    }
  }, [])

  return (
    <DataTable
      columns={columns}
      records={tableData}
      fetching={isLoading}
      loaderVariant='dots'
      noRecordsText={null}
      //defaultColumnRender={ColumnRender}
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
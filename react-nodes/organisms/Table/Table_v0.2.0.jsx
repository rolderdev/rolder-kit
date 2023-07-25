import { Text, Avatar, Box, useMantineTheme, CloseButton, Group } from '@mantine/core'
import { useShallowEffect } from '@mantine/hooks'
import { DataTable } from 'mantine-datatable'
import { getValue } from '../../../utils/data/v.0.1.0/data'
import { useState } from 'react'
import Icons from '../../../libs/icons/Icons_v0.1.0'

function Table(props) {
  const { className, tableData, columns, isLoading, selectable, selectableType, highlightSelectedRow, selectFirstItem, resetSelected } = props

  const [selectedId, setSelectedId] = useState('')
  const enableOnRowClick = selectable === true && selectableType === 'singleRow'

  // defaults
  useShallowEffect(() => {
    setSelectedId(selectFirstItem ? tableData?.[className]?.[0]?.id : '')
    props.selectedItem(selectFirstItem ? tableData?.[className]?.[0]?.id : '')
  }, [className])

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
          default: c.render = (record) => record[c.accessor]
        }
      })
    }
  }, [])


  const ColumnRender = (row, _, accessor) => {
    /* const columnProps = columns.find(c => c.accessor === accessor)
    const dataType = columnProps.dataType
    const fieldFormat = columnProps.fieldFormat || accessor
    let value = getValue(row, fieldFormat)

    switch (dataType) {
      case 'date': value = dayjs(value).format(columnProps.dateFormat); break
    } */
    //console.log('+')
    return <CloseButton />

    /* switch (columnProps.columnRender) {
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
      case 'actions': Comp = <CloseButton />; break
      return (<Group spacing={4} position="right" noWrap>
        {columnProps.actions.map(a => {
          console.log('+')
          switch (a.type) {
            case 'closeButton':
              return <CloseButton {...a.props} />
          }
        })}
      </Group>)
      default: Comp = <Text >{value}</Text>
    } */
  }

  return (
    <DataTable
      columns={columns}
      records={tableData?.[className] || []}
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

export default function Table_v0_2_0(props) {
  const { className, columns } = props
  const [enabled, setEnabled] = useState(false)

  useShallowEffect(() => {
    if (className && columns) setEnabled(true)
  }, [columns])
  return enabled ? <Table {...props} /> : <></>
}
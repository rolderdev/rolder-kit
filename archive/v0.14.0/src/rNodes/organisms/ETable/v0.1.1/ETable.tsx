import { Group, Text, createStyles, MultiSelect, Box, Stack, Button, ActionIcon, Checkbox, Indicator, } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useShallowEffect, useSetState, } from '@mantine/hooks'
import { DataTable } from 'mantine-datatable'
import { useState } from 'react'
import { getValue, filterBy } from '../../../../utils/data/v0.2.0/data'
import Icons from '../../../../libs/icons/v0.1.0/Icons'

// nested style
const useStyles = createStyles(() => ({
  expandIcon: {
    transition: 'transform 0.2s ease',
  },
  expandIconRotated: {
    transform: 'rotate(180deg)',
  },
}))

const IconChevronDown = Icons('IconChevronDown')
const IconEdit = Icons('IconEdit')

export default function ETable_v0_1_1(props: any) {
  const Dayjs = window.Dayjs
  const { tableScheme, searchEnabled, tableData, foundedData, filterMaps } = props

  const [expandedIds, setExpandedIds] = useSetState<any>(() => {
    const ids: any = {}
    tableScheme?.filter((ts: any) => ts.level < tableScheme.length - 1).forEach((ts: any) => ids[ts.className] = [])
    return ids
  })
  const [selectedData, setSelectedData] = useSetState<any>(() => {
    const sData: any = {}
    tableScheme[0].columns.filter((c: any) => c.filterScheme)?.forEach((c: any) => sData[c.filterScheme.valueField] = [])
    return sData
  })

  const [selectedRecords, setSelectedRecords] = useState<any[]>([])

  const [selectedFilters, setSelectedFilters] = useState<any[]>([])
  const [resultData, setResultData] = useState<any[]>([])

  useShallowEffect(() => {
    setSelectedRecords([])
    props.selectedItems([])
    if (tableData) {
      let filteredData: any = { ...tableData }

      if (selectedFilters.length) {
        setSelectedData([])
        filteredData.task = []
        tableData.task.forEach((task: any) => {
          let count = 0
          selectedFilters.forEach(filter => {
            const contentType = tableScheme[0].columns.find((c: any) => c.filterScheme?.valueField === filter).filterScheme.contentType
            switch (contentType) {
              case 'state': if (selectedData[filter].includes(getValue(task, filter))) count++; break
              case 'date': {
                const dateValue = Dayjs(getValue(task, filter))
                const filterValue = selectedData[filter]
                if (filterValue[0] && filterValue[1] && Dayjs(dateValue).isBetween(filterValue[0], filterValue[1], 'day', '[]')) count++
              }
                break
              default: if (selectedData[filter].includes(task[filter]?.id)) count++
            }
          })
          if (count === selectedFilters.length) {
            filteredData.task.push(task)
          }
        })
      }

      if (searchEnabled) {
        setSelectedData([])
        filteredData = filterBy({
          initialData: filteredData,
          filterByData: foundedData,
          filterMap: filterMaps[0].search
        })
      } else {
        filteredData = filterBy({
          initialData: tableData,
          filterByData: filteredData,
          filterMap: filterMaps[0].data
        })
      }

      setResultData(filteredData)
      if (searchEnabled || selectedFilters.length) {
        setExpandedIds(() => {
          const ids: any = {}
          tableScheme?.filter((ts: any) => ts.level < tableScheme.length - 1).forEach((ts: any) =>
            ids[ts.className] = filteredData ? filteredData[ts.className]?.map((d: any) => d.id) : []
          )
          return ids
        })
      }
    }
  }, [tableData, foundedData, searchEnabled, selectedFilters, selectedData])

  // ui
  const { cx, classes, theme } = useStyles()

  const ColumnRender = (row: any, _: number, accessor: any, currentTableScheme: any) => {
    const isFirstColumn = currentTableScheme.columns[0].accessor === accessor
    const isLastColumn = currentTableScheme.level === tableScheme.length - 1
    const expandable = tableScheme[currentTableScheme.level + 1] && isFirstColumn
    let ml = -0.5
    const expandWidth = currentTableScheme.selectable ? 0.5 : 2.5
    switch (currentTableScheme.level) {
      case 1:
        ml = 0.5
        if (isLastColumn && !expandable) ml = ml + expandWidth
        break
      case 2: ml = 1.75; break
      case 3: ml = 3; break
    }

    const currentCellProps = currentTableScheme.columns.find((ts: any) => ts.accessor === accessor)
    let formatedValue: any = ''
    const fieldFormat = currentCellProps.fieldFormat || accessor
    switch (currentCellProps.type) {
      case 'date': formatedValue = Dayjs(getValue(row, fieldFormat)).format(currentCellProps.dateFormat); break
      default: formatedValue = getValue(row, fieldFormat)
    }

    const Chevron = () => {
      return (
        < ActionIcon
          color="dark"
          onClick={() => {
            const eIds = [...expandedIds[currentTableScheme?.className]]
            if (eIds.includes(row.id)) {
              setExpandedIds({ [currentTableScheme?.className]: eIds.filter(e => e !== row.id) })
            } else {
              eIds.push(row.id)
              setExpandedIds({ [currentTableScheme?.className]: eIds })
            }
          }
          }
        >
          <IconChevronDown
            size="1rem"
            className={cx(classes.expandIcon, {
              [classes.expandIconRotated]: expandedIds[currentTableScheme.className].includes(row.id),
            })}
          />
        </ActionIcon >
      )
    }

    const Actions = () => {
      return (
        <Group spacing={4} position="right" noWrap>
          <ActionIcon
            color="dark"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              props.selectedItem(row)
              props.editItem()
            }}
          >
            <IconEdit size={20} />
          </ActionIcon>
        </Group >
      )
    }

    const Selectable = () => {
      return (
        <Checkbox
          ml={4}
          radius='md'
          color='dark'
          onClick={(e) => e.stopPropagation()}
          checked={selectedRecords.includes(row.id)}
          onChange={() => {
            const sr = [...selectedRecords]
            if (sr.includes(row.id)) {
              setSelectedRecords(sr.filter(e => e !== row.id))
              props.selectedItems(sr.filter(e => e !== row.id))
            } else {
              sr.push(row.id)
              setSelectedRecords(sr)
              props.selectedItems(sr)
            }
          }}
        />
      )
    }

    if (isFirstColumn) {
      return (
        <Group noWrap w='100%'>
          {currentTableScheme.selectable && <Selectable />}
          {expandable && <Chevron />}
          <Group ml={ml + 'rem'} w='100%'>
            {
              currentTableScheme.hasActions
                ? <Group position='apart' noWrap w='100%'>
                  <Text>{formatedValue}</Text>
                  <Actions />
                </Group>
                : <Text>{formatedValue}</Text>
            }
          </Group>
        </Group>
      )
    } else if (currentCellProps.type === 'actionIcon') {
      const Icon = Icons(currentCellProps.iconName)
      return <Group position='center' w='100%'>
        <ActionIcon
          disabled={row.content?.results?.images ? false : true}
          color="dark"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            props.selectedItem(row)
            props.viewImages()
          }}
        >
          <Icon size={20} />
        </ActionIcon>
      </Group>
    } else return <Text>{formatedValue}</Text>
  }

  function NestedDataTable(parentItem: any, parentTableScheme: any, currentTableScheme: any) {
    const nextLevelScheme = tableScheme[currentTableScheme.level + 1]
    let currentData = { [currentTableScheme.className]: resultData?.[currentTableScheme.className].filter((d: any) => d[parentTableScheme.className].id === parentItem.record.id) }

    const nestedProps = {
      verticalSpacing: props.verticalSpacing,
      fontSize: props.fontSize,
      ...currentTableScheme.props,
    }

    let ckickRow
    if (nextLevelScheme) ckickRow = false
    else ckickRow = (data: any) => {
      props.selectedItem(data)
      props.viewItem()
    }

    return <DataTable
      columns={currentTableScheme.columns}
      records={currentData?.[currentTableScheme.className]}
      noRecordsText={null}
      noHeader={true}
      defaultColumnRender={(row, _, accessor) => ColumnRender(row, _, accessor, currentTableScheme)}
      onRowClick={ckickRow}
      rowExpansion={nextLevelScheme && {
        allowMultiple: true,
        trigger: 'never',
        collapseProps: {
          transitionDuration: 100,
          animateOpacity: false,
        },
        expanded: { recordIds: expandedIds[currentTableScheme?.className] },
        content: (parentItem) => (nextLevelScheme && NestedDataTable(parentItem, currentTableScheme, nextLevelScheme))
      }}
      scrollAreaProps={{ type: 'never' }}
      highlightOnHover={!nextLevelScheme}
      rowStyle={{
        backgroundColor: theme.colors.red[nextLevelScheme ? 2 : 1],
      }}
      {...nestedProps}
    />
  }

  // filters
  useShallowEffect(() => {
    let selectedFilters: any[] = []
    Object.keys(selectedData).forEach(key => {
      if (selectedData[key]?.length > 0) selectedFilters.push(key)
    })
    setSelectedFilters(selectedFilters)
  }, [selectedData])

  if (tableScheme) {
    const filters: any[] = tableScheme[0].columns.filter((c: any) => c.filterScheme)
    if (filters) {
      filters.forEach(column => {
        const filterProps = { ...column.filterScheme }
        column.filtering = selectedData[filterProps.valueField]?.length > 0
        switch (filterProps.type) {
          case 'MultiSelect':
            column.filter = (
              <Box w={filterProps.props.width}>
                <MultiSelect
                  data={tableData?.[filterProps.valueField].map((item: any) => ({ value: item.id, label: getValue(item, filterProps.labelField) }))}
                  value={selectedData[filterProps.valueField]}
                  nothingFound="Не найдено"
                  onChange={(ids) => setSelectedData({ [filterProps.valueField]: ids })}
                  clearable
                  searchable
                  {...filterProps.props}
                />
              </Box>
            )
            break
          case 'MultiSelectWithData':
            column.filter = (
              <Box w={filterProps.props.width}>
                <MultiSelect
                  data={filterProps.data}
                  value={selectedData[filterProps.valueField]}
                  nothingFound="Не найдено"
                  onChange={(ids) => setSelectedData({ [filterProps.valueField]: ids })}
                  clearable
                  searchable
                  {...filterProps.props}
                />
              </Box>
            )
            break
          case 'DatePicker':
            column.filter = ({ close }: { close: any }) => (
              <Stack>
                <DatePicker
                  type="range"
                  value={selectedData[filterProps.valueField]}
                  onChange={(dates) => setSelectedData({ [filterProps.valueField]: dates })}
                  renderDay={(date) => {
                    const day = date.getDate()
                    return (
                      <Indicator size={6} color="blue" offset={-5} disabled={Dayjs(date).dayOfYear() !== Dayjs().dayOfYear()}>
                        <div>{day}</div>
                      </Indicator>
                    )
                  }
                  }
                />
                < Button
                  disabled={!selectedData[filterProps.valueField]}
                  color="red"
                  onClick={() => {
                    setSelectedData({ [filterProps.valueField]: [] })
                    close();
                  }
                  }
                >
                  Сбросить
                </Button >
              </Stack >
            )
            break
        }
      })
    }
  }

  return (
    <DataTable
      columns={tableScheme[0]?.columns}
      records={resultData?.[tableScheme[0]?.className]}
      fetching={resultData ? false : true}
      loaderVariant='dots'
      noRecordsText={null}
      sx={{ background: 'white', width: props.width }}
      defaultColumnRender={(row, _, accessor) => ColumnRender(row, _, accessor, tableScheme[0])}
      rowExpansion={{
        allowMultiple: true,
        trigger: 'never',
        collapseProps: {
          transitionDuration: 100,
          animateOpacity: false,
        },
        expanded: { recordIds: expandedIds[tableScheme[0]?.className] },
        content: (parentItem) => (NestedDataTable(parentItem, tableScheme[0], tableScheme[1]))
      }}
      rowStyle={({ id }) => ({
        backgroundColor: theme.colors.red[expandedIds[tableScheme[0]?.className].includes(id) && 3]
      })}
      {...props}
    />
  )
}
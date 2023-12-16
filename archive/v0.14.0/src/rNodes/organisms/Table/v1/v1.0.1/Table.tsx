import { forwardRef, useImperativeHandle } from 'react'
import { MRT_TableContainer, } from 'mantine-react-table';

import { Paper } from '@mantine/core';

import BarLoader from 'react-spinners/BarLoader'
import { convertColor } from '../../../../../utils/converters/v0.1.0/converters';
import getTabelInstance from './TableInstance';
import { TableCompProps } from './types/TableCompProps';

const Comp = forwardRef(function (props: TableCompProps, ref) {
  const { items, tableSearching, loaderColor, withBorder, shadow, radius } = props

  // signals
  useImperativeHandle(ref, () => ({
    expandAll() { table.toggleAllRowsExpanded(true) },
    unExpandAll() { table.toggleAllRowsExpanded(false) }
  }), [items])

  const table = getTabelInstance(props)

  return (
    <Paper
      shadow={shadow}
      withBorder={withBorder}
      radius={radius}
      sx={{ overflow: 'hidden' }}
    >
      <BarLoader
        color={convertColor(loaderColor)}
        loading={tableSearching}
        cssOverride={{
          display: "block",
          position: 'absolute',
          width: '100%',
          zIndex: 2,
          borderRadius: 4
        }}
      />
      <MRT_TableContainer table={table} />
    </Paper>
  )
})

export default Comp
import { useMemo } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef, MRT_Table, MRT_TableContainer } from 'mantine-react-table';
import { Paper } from '@mantine/core';

//If using TypeScript, define the shape of your data (optional, but recommended)
interface Person {
  name: string;
  age: number;
}

//mock data - strongly typed if you are using TypeScript (optional, but recommended)
const data: Person[] = [
  {
    name: 'John',
    age: 30,
  },
  {
    name: 'Sara',
    age: 25,
  },
];

export default function Table_v1_0_0(props: any) {
  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name', //simple recommended way to define a column
        header: 'Name',
        minSize: 200,
        maxSize: 500
      },
      {
        accessorFn: (originalRow) => originalRow.age, //alternate way
        id: 'age', //id required if you use accessorFn instead of accessorKey
        header: 'Age',
        size: 40
      },
    ],
    [],
  );

  //pass table options to useMantineReactTable
  const table = useMantineReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowSelection: false, //enable some features
    enableColumnOrdering: false,
    enableGlobalFilter: false, //turn off a feature
    columnFilterDisplayMode: 'popover',
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    //enableTopToolbar: false,
    //enableBottomToolbar: false,
    mantineTableProps: {
      highlightOnHover: false,
      withColumnBorders: true,
      withBorder: false,
    },    
  });

  return (
    <Paper shadow='sm' radius='md' sx={{ overflow: 'hidden' }}>
      <MRT_Table table={table} />
    </Paper>
  )
}
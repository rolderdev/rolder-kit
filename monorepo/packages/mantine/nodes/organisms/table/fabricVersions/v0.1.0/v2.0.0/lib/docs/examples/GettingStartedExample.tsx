import { Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

export default function GettingStartedExample() {
  return (
    <DataTable
      withBorder
      borderRadius="sm"
      withColumnBorders
      striped
      highlightOnHover
      // provide data
      records={[
        { id: 1, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        // example-skip more records
        { id: 2, name: 'Donald Trump', bornIn: 1946, party: 'Republican' },
        { id: 3, name: 'Barack Obama', bornIn: 1961, party: 'Democratic' },
        { id: 4, name: 'George W. Bush', bornIn: 1946, party: 'Republican' },
        { id: 5, name: 'Bill Clinton', bornIn: 1946, party: 'Democratic' },
        { id: 6, name: 'George H. W. Bush', bornIn: 1924, party: 'Republican' },
        { id: 7, name: 'Ronald Reagan', bornIn: 1911, party: 'Republican' },
        { id: 8, name: 'Jimmy Carter', bornIn: 1924, party: 'Democratic' },
        { id: 9, name: 'Gerald Ford', bornIn: 1913, party: 'Republican' },
        { id: 10, name: 'Richard Nixon', bornIn: 1913, party: 'Republican' },
        // example-resume
      ]}
      // define columns
      columns={[
        {
          accessor: 'id',
          // this column has a custom title
          title: '#',
          // right-align column
          textAlignment: 'right',
        },
        { accessor: 'name' },
        {
          accessor: 'party',
          // this column has custom cell data rendering
          render: ({ party }) => (
            <Text weight={700} color={party === 'Democratic' ? 'blue' : 'red'}>
              {party.slice(0, 3).toUpperCase()}
            </Text>
          ),
        },
        { accessor: 'bornIn' },
      ]}
      // execute this callback when a row is clicked
      onRowClick={({ name, party, bornIn }) =>
        alert(`You clicked on ${name}, a ${party.toLowerCase()} president born in ${bornIn}`)
      }
    />
  );
}

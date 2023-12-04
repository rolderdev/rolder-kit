import { Box } from '@mantine/core';
import dayjs from 'dayjs';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import employees from '~/data/employees.json';

const PAGE_SIZES = [10, 15, 20];

export default function PaginationExampleWithPageSizeSelector() {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(employees.slice(0, pageSize));

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords(employees.slice(from, to));
  }, [page, pageSize]);

  return (
    <Box sx={{ height: 300 }}>
      <DataTable
        withBorder
        records={records}
        columns={[
          { accessor: 'firstName', width: 100 },
          { accessor: 'lastName', width: 100 },
          { accessor: 'email', width: '100%' },
          {
            accessor: 'birthDate',
            textAlignment: 'right',
            width: 120,
            render: ({ birthDate }) => dayjs(birthDate).format('MMM D YYYY'),
          },
        ]}
        totalRecords={employees.length}
        paginationColor="grape"
        recordsPerPage={pageSize}
        page={page}
        onPageChange={(p) => setPage(p)}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
      />
    </Box>
  );
}

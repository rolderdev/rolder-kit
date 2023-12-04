import { Box, Button, MultiSelect, Stack, TextInput } from '@mantine/core';
import { DatePicker, type DatesRangeValue } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { DataTable } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import { employees } from '~/data';

const initialRecords = employees.slice(0, 100);

export default function SearchingAndFilteringExample() {
  const [records, setRecords] = useState(initialRecords);

  const departments = useMemo(() => {
    const departments = new Set(employees.map((e) => e.department.name));
    return [...departments];
  }, []);

  const [query, setQuery] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [birthdaySearchRange, setBirthdaySearchRange] = useState<DatesRangeValue>();
  const [debouncedQuery] = useDebouncedValue(query, 200);

  useEffect(() => {
    setRecords(
      initialRecords.filter(({ firstName, lastName, department, birthDate }) => {
        if (
          debouncedQuery !== '' &&
          !`${firstName} ${lastName}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
        ) {
          return false;
        }

        if (
          birthdaySearchRange &&
          birthdaySearchRange[0] &&
          birthdaySearchRange[1] &&
          (dayjs(birthdaySearchRange[0]).isAfter(birthDate, 'day') ||
            dayjs(birthdaySearchRange[1]).isBefore(birthDate, 'day'))
        ) {
          return false;
        }

        if (selectedDepartments.length && !selectedDepartments.some((d) => d === department.name)) {
          return false;
        }
        return true;
      })
    );
  }, [debouncedQuery, birthdaySearchRange, selectedDepartments]);

  return (
    <Box sx={{ height: 300 }}>
      <DataTable
        withBorder
        records={records}
        columns={[
          {
            accessor: 'name',
            render: ({ firstName, lastName }) => `${firstName} ${lastName}`,
            filter: (
              <TextInput
                label="Employees"
                description="Show employees whose names include the specified text"
                placeholder="Search employees..."
                icon={<IconSearch size={16} />}
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
              />
            ),
            filtering: query !== '',
          },
          {
            accessor: 'department.name',
            filter: (
              <MultiSelect
                label="Departments "
                description="Show all employees working at the selected departments"
                data={departments}
                value={selectedDepartments}
                placeholder="Search departments…"
                onChange={setSelectedDepartments}
                icon={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: selectedDepartments.length > 0,
          },
          { accessor: 'department.company.name' },
          {
            accessor: 'birthDate',
            render: ({ birthDate }) => dayjs(birthDate).format('MMM DD YYYY'),
            filter: ({ close }) => (
              <Stack>
                <DatePicker
                  maxDate={new Date()}
                  type="range"
                  value={birthdaySearchRange}
                  onChange={setBirthdaySearchRange}
                />
                <Button
                  disabled={!birthdaySearchRange}
                  color="red"
                  onClick={() => {
                    setBirthdaySearchRange(undefined);
                    close();
                  }}
                >
                  Reset
                </Button>
              </Stack>
            ),
            filtering: Boolean(birthdaySearchRange),
          },
          { accessor: 'age', render: ({ birthDate }) => dayjs().diff(birthDate, 'y') },
        ]}
      />
    </Box>
  );
}

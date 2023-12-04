import { ActionIcon, Box, Button, Grid, Group, Stack, Text } from '@mantine/core';
import { closeModal, openModal } from '@mantine/modals';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { employees, type Employee } from '~/data';

const records = employees.slice(0, 5);

const showModal = ({ employee, action }: { employee: Employee; action: 'view' | 'edit' | 'delete' }) => {
  openModal({
    modalId: action,
    title:
      action === 'view'
        ? 'Showing company information'
        : action === 'edit'
        ? 'Editing company information'
        : 'Deleting company',
    children: (
      <Stack>
        <Text>
          {action === 'view'
            ? 'Here’s where you could show more information...'
            : action === 'edit'
            ? 'Here’s where you could put an edit form...'
            : 'Here’s where you could ask for confirmation before deleting...'}
        </Text>
        <Grid gutter="xs">
          <Grid.Col span={2}>ID</Grid.Col>
          <Grid.Col span={10}>{employee.id}</Grid.Col>
          <Grid.Col span={2}>First name</Grid.Col>
          <Grid.Col span={10}>{employee.firstName}</Grid.Col>
          <Grid.Col span={2}>Last name</Grid.Col>
          <Grid.Col span={10}>{employee.lastName}</Grid.Col>
        </Grid>
        <Button onClick={() => closeModal(action)}>Close</Button>
      </Stack>
    ),
  });
};

export default function PinLastColumnExample() {
  // example-start
  return (
    <DataTable
      pinLastColumn // 👈 make sure the last column is always visible
      withBorder
      columns={[
        { accessor: 'firstName', noWrap: true },
        { accessor: 'lastName', noWrap: true },
        { accessor: 'department.name', title: 'Department' },
        { accessor: 'department.company.name', title: 'Company', noWrap: true },
        { accessor: 'department.company.city', title: 'City', noWrap: true },
        { accessor: 'department.company.state', title: 'State' },
        { accessor: 'department.company.streetAddress', title: 'Address', noWrap: true },
        { accessor: 'department.company.missionStatement', title: 'Mission statement', noWrap: true },
        {
          accessor: 'actions',
          title: <Box mr={6}>Row actions</Box>,
          textAlignment: 'right',
          render: (employee) => (
            // example-skip action cells custom rendering
            <Group spacing={4} noWrap position="right">
              <ActionIcon
                size="sm"
                variant="subtle"
                color="green"
                onClick={() => showModal({ employee, action: 'view' })}
              >
                <IconEye size={16} />
              </ActionIcon>
              <ActionIcon
                size="sm"
                variant="subtle"
                color="blue"
                onClick={() => showModal({ employee, action: 'edit' })}
              >
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon
                size="sm"
                variant="subtle"
                color="red"
                onClick={() => showModal({ employee, action: 'delete' })}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
            // example-resume
          ),
        },
      ]}
      records={records}
    />
  );
  // example-end
}

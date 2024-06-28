/* Функция добавляет шеврон к ячейке.
Шеврон - иконка, если onRowClick = expansion, actionIcon, если onRowClick !== expansion. */

import { ActionIcon, Box } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';
import { memo, useContext } from 'react';
import { useStore } from 'zustand';
import { TableContext } from '../store/store';

import classes from '../styles/expansionCell.module.css';

export default memo((p: { cell: React.ReactNode; rowId: string }) => {
	const store = useContext(TableContext);
	if (!store) return;

	const onRowClick = useStore(store, (s) => s.tableProps.onRowClick);

	// Вытягиваем реактивное состояние развернутости для анимации шеврона.
	const expanded = useStore(store, (s) => s.expandedRowIds.includes(p.rowId));

	if (onRowClick === 'expansion')
		return (
			<Box style={{ display: 'flex', flexDirection: 'row' }}>
				<IconChevronRight
					className={clsx(classes.icon, classes.expandIcon, {
						[classes.expandIconRotated]: expanded,
					})}
				/>
				{p.cell}
			</Box>
		);
	else
		return (
			<Box style={{ display: 'flex', flexDirection: 'row' }}>
				<ActionIcon
					onClick={() =>
						store.setState((s) => ({
							expandedRowIds: expanded ? s.expandedRowIds.filter((i) => i !== p.rowId) : [...s.expandedRowIds, p.rowId],
						}))
					}
				>
					<IconChevronRight
						className={clsx(classes.icon, classes.expandIcon, {
							[classes.expandIconRotated]: expanded,
						})}
					/>
				</ActionIcon>
				{p.cell}
			</Box>
		);
});

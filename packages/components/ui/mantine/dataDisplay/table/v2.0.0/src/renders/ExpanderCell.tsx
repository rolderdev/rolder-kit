/* Функция добавляет шеврон к ячейке.
Шеврон - иконка, если onRowClick = expansion, actionIcon, если onRowClick !== expansion. */

import { memo } from 'react';
import { ActionIcon, Box } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';

import classes from '../styles/expansionCell.module.css';
import { useStore } from '../store';

export default memo((p: { cell: React.ReactNode; itemId: string }) => {
	const store = useStore();
	if (!store) return;

	const getExpandedIds = () => {
		const allowMultiple = store.tableProps.expansion.allowMultiple.get();
		if (expanded) return allowMultiple ? store.expandedIds.get().filter((i) => i !== p.itemId) : [];
		else return allowMultiple ? [...store.expandedIds.get(), p.itemId] : [p.itemId];
	};

	const onRowClick = store.tableProps.onRowClick.use();

	// Вытягиваем реактивное состояние развернутости для анимации шеврона.
	const expanded = store.expandedIds.use((expandedIds) => expandedIds.includes(p.itemId));

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
					variant="subtle"
					color="dark"
					my={-3.5}
					ml={-5.5}
					mr={3.5}
					onClick={() => store.expandedIds.set(getExpandedIds())}
				>
					<IconChevronRight
						className={clsx(classes.actionIcon, classes.expandIcon, {
							[classes.expandIconRotated]: expanded,
						})}
					/>
				</ActionIcon>
				{p.cell}
			</Box>
		);
});

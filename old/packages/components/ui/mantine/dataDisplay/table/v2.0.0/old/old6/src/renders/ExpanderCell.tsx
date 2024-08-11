/* Функция добавляет шеврон к ячейке.
Шеврон - иконка, если onRowClick = expansion, actionIcon, если onRowClick !== expansion. */

import { memo } from 'react';
import { ActionIcon, Box, Group } from '@mantine/core';
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

	// Определим, исключена ли строка из развертывния разработчиком.
	const filterFunc = store.tableProps.expansion.filterFunc?.get();
	const item = store.items.get((items) => items.find((i) => i.id === p.itemId));
	const disabled = item && filterFunc ? !filterFunc(item) : false;

	const paddingLeft = store.tableProps.expansion.paddingLeft.use();
	const level = store.level.use();

	if (onRowClick === 'expansion')
		return (
			<Group pl={paddingLeft.position === 'expander' ? paddingLeft.value * level : undefined} wrap="nowrap" gap={6}>
				<Box mt={1} ml={1} my={-1} mr={-1}>
					<IconChevronRight
						color={disabled ? '#adb5bd' : '#2e2e2e'}
						className={clsx(classes.icon, classes.expandIcon, {
							[classes.expandIconRotated]: expanded,
						})}
					/>
				</Box>
				{p.cell}
			</Group>
		);
	else
		return (
			<Group pl={paddingLeft.position === 'expander' ? paddingLeft.value * level : undefined} wrap="nowrap" gap={6}>
				<ActionIcon
					variant="subtle"
					color="dark"
					my={-3.5}
					ml={-5.5}
					mr={3.5}
					onClick={(e) => {
						e.stopPropagation();
						store.expandedIds.set(getExpandedIds());
					}}
					disabled={disabled}
					style={{ background: disabled ? 'transparent' : undefined }}
				>
					<IconChevronRight
						className={clsx(classes.actionIcon, classes.expandIcon, {
							[classes.expandIconRotated]: expanded,
						})}
					/>
				</ActionIcon>
				{p.cell}
			</Group>
		);
});

/* Функция добавляет шеврон к ячейке.
Шеврон - иконка, если onRowClick = expansion, actionIcon, если onRowClick !== expansion. */

import { memo } from 'react';
import { ActionIcon, Box, Group } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';

import classes from '../styles/expansionCell.module.css';
import { useStore } from '../store/store';
import { setExpandedItems, toggleRowExpansion } from '../models/expansionModel';

export default memo((p: { cell: React.ReactNode; itemId: string }) => {
	const s = useStore();
	if (!s) return;

	const onRowClick = s.hot.tableProps.onRowClick.use();

	// Вытягиваем реактивное состояние развернутости для анимации шеврона.
	let expanded = s.hot.expandedIds.use((expandedIds) => expandedIds?.includes(p.itemId));

	// Определим, исключена ли строка из развертывния разработчиком.
	const filterFunc = s.cold.tableProps.expansionFilterFunc?.get();
	const item = s.hot.items.get((items) => items?.find((i) => i.id === p.itemId));
	// Свернем строку, если у нее больше нет детей.
	if (item) {
		const node = s.scopeStore
			.get()
			?.hierarchy.get()
			?.find((i) => i.data.id === item.id);
		if (node && !node?.children && expanded) {
			expanded = false;
			setExpandedItems(
				s,
				s.cold.expandedItems.get().filter((i) => i.id !== item.id)
			);
		}
	}
	const disabled = item && filterFunc ? !filterFunc(item) : false;

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = s.hot.tableProps.rowStyles.paddingLeftPostion.use();
	const level = s.level.use();
	const pl = s.hot.tableProps.use((state) =>
		state.paddingLeftFunc?.(
			level,
			s.hot.items.get((i) => i.find((i) => i.id === p.itemId))
		)
	);

	if (onRowClick === 'expansion')
		return (
			<Group pl={paddingLeftPostion === 'expander' ? pl : undefined} wrap="nowrap" gap={6}>
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
			<Group pl={paddingLeftPostion === 'expander' ? pl : undefined} wrap="nowrap" gap={6}>
				<ActionIcon
					variant="subtle"
					color="dark"
					my={-3.5}
					ml={-5.5}
					mr={3.5}
					onClick={(e) => {
						e.stopPropagation();
						if (item) toggleRowExpansion(s, item);
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

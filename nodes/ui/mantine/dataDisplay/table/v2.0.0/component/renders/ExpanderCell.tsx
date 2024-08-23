/* Функция добавляет шеврон к ячейке.
Шеврон - иконка, если onRowClick = expansion, actionIcon, если onRowClick !== expansion. */

import { memo, useContext } from 'react';
import { ActionIcon, Box, Group } from '@mantine/core';
import clsx from 'clsx';

import classes from '../styles/expansionCell.module.css';
import { TableContext } from '../TableProvider';
import { toggleRowExpansion } from '../models/expansionModel';
import type { FrontItem } from '@shared/types-v0.1.0';

export default memo((p: { cell: React.ReactNode; itemId: string }) => {
	const { useSnapshot, snapshot } = R.libs.valtio;

	const store = useContext(TableContext);
	const snap = useSnapshot(store);

	const onRowClick = store.tableProps.onRowClick;
	const ChevronIcon = R.libs.icons['IconChevronRight'];
	const item = R.libs.just.get(store.items, p.itemId) as FrontItem | undefined;

	// Вытягиваем реактивное состояние развернутости для анимации шеврона.
	let expanded = snap.expandedIds.includes(p.itemId);

	// Определим, исключена ли строка из развертывния разработчиком.
	const filterFunc = store.tableProps.expansion.filterFunc;
	const hierarchyNode = snap.hierarchyNode?.find((i) => i.data.id === item?.id);
	const disabled = item && filterFunc ? !filterFunc(snapshot(item), hierarchyNode) : false;

	// Свернем строку, если у нее больше нет детей.
	if (hierarchyNode && !hierarchyNode.children && expanded && disabled) {
		expanded = false;
		store.expandedIds = snap.expandedIds.filter((i) => i !== item?.id);
	}

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion;
	const level = store.level;
	const pl = item && store.tableProps.paddingLeftFunc?.(level, snapshot(item));

	if (onRowClick === 'expansion')
		return (
			<Group pl={paddingLeftPostion === 'expander' ? pl : undefined} wrap="nowrap" gap={6}>
				<Box mt={1} ml={1} my={-1} mr={-1}>
					<ChevronIcon
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
						if (item) toggleRowExpansion(store, p.itemId);
					}}
					disabled={disabled}
					style={{ background: disabled ? 'transparent' : undefined }}
				>
					<ChevronIcon
						className={clsx(classes.actionIcon, classes.expandIcon, {
							[classes.expandIconRotated]: expanded,
						})}
					/>
				</ActionIcon>
				{p.cell}
			</Group>
		);
});

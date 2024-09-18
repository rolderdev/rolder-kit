import { memo, useContext } from 'react';
import { ActionIcon, Box, Group } from '@mantine/core';
import clsx from 'clsx';
import { TableContext } from '../TableProvider';
import { expansionDisabled, toggleRowExpansion } from '../models/expansion';
import Cell from './Cell';
import useNode from '../funcs/useNode';
import useItem from '../funcs/useItem';

import classes from '../styles/expansionCell.module.css';

export default memo((p: { columnIdx: string; id: string }) => {
	const { useSnapshot } = R.libs.valtio;

	const store = useContext(TableContext);
	const snap = useSnapshot(store);

	const onRowClick = store.tableProps.onRowClick;
	const ChevronIcon = R.libs.icons['IconChevronRight'];

	const itemSnap = useItem(p.id, 'snap');

	// Вытягиваем реактивное состояние развернутости для анимации шеврона.
	const expanded = snap.expandedIds[p.id];

	// Определим, исключена ли строка из развертывния разработчиком.
	const disabled = expansionDisabled(store, p.id) || snap.expanders[p.id];

	// Реактивность на изменение ноды.
	const nodeSub = useNode(store, p.id, 'sub');
	if (nodeSub) {
		// Установим новое состояние, если оно изменилось в иерархии и если не отфильтровано разработчиком.
		if (!disabled) store.expandedIds[p.id] = nodeSub.states.expansion.value;
		// Свернем строку, если у нее больше нет детей.
		if (!nodeSub.childIds && expanded) store.expandedIds[p.id] = false;
		// Добавим состояне детей для чекбокса.
		store.checkboxes.hasChildren[p.id] = nodeSub.childIds.length > 0;
	}

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion;
	const level = store.hierarchy.level;
	const pl = itemSnap && store.tableProps.paddingLeftFunc?.(level, itemSnap);

	//console.log('Expander render', level);
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
				<Cell columnIdx={p.columnIdx} id={p.id} />
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
						toggleRowExpansion(store, p.id);
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
				<Cell columnIdx={p.columnIdx} id={p.id} />
			</Group>
		);
});

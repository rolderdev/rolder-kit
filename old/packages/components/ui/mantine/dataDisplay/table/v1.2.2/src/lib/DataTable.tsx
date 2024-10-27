import { Box, type MantineSize, type MantineTheme, Portal, Table, createStyles, getStylesRef, packSx, px } from '@mantine/core'
import { useMergedRef } from '@mantine/hooks'
import {
	type TableSelectionScopeInternal,
	type TableSelectionScopeValues,
	tableHandlerAtom,
	tableSelectionChildIdsByParentIdAtom,
	tableSelectionClickItemIdAtom,
	tableSelectionScopeAtom,
	tableSelectionScopeInternalAtom,
} from '@packages/scope'
import { useStore } from 'jotai' // useAtom, useSetAtom,
import {
	type CSSProperties,
	type ChangeEventHandler,
	type Key,
	type MouseEventHandler,
	useCallback,
	useMemo,
	useState,
} from 'react'
import React from 'react'
import { DataTableDragToggleColumnsProvider } from './DataTableDragToggleColumnsProvider'
import DataTableEmptyRow from './DataTableEmptyRow'
import DataTableEmptyState from './DataTableEmptyState'
import DataTableFooter from './DataTableFooter'
import DataTableHeader from './DataTableHeader'
import DataTableLoader from './DataTableLoader'
import DataTablePagination from './DataTablePagination'
import DataTableRow from './DataTableRow'
import DataTableRowMenu from './DataTableRowMenu'
import DataTableRowMenuDivider from './DataTableRowMenuDivider'
import DataTableRowMenuItem from './DataTableRowMenuItem'
import DataTableScrollArea from './DataTableScrollArea'
import {
	useDataTableColumns,
	useElementOuterSize,
	useLastSelectionChangeIndex,
	useRowContextMenu,
	useRowExpansion,
} from './hooks'
import type { DataTableProps } from './types'
import { differenceBy, getRecordId, humanize, uniqBy, useIsomorphicLayoutEffect } from './utils'

const EMPTY_OBJECT = {}

const useStyles = createStyles(
	(
		theme,
		{
			borderColor,
			rowBorderColor,
		}: {
			borderColor: string | ((theme: MantineTheme) => string)
			rowBorderColor: string | ((theme: MantineTheme) => string)
		}
	) => {
		const borderColorValue = typeof borderColor === 'function' ? borderColor(theme) : borderColor
		const rowBorderColorValue = typeof rowBorderColor === 'function' ? rowBorderColor(theme) : rowBorderColor
		const shadowGradientAlpha = theme.colorScheme === 'dark' ? 0.5 : 0.05

		return {
			root: {
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
				tr: {
					backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
				},
				'&&': {
					'thead tr th': {
						borderBottomColor: borderColorValue,
					},
					'tbody tr td': {
						borderTopColor: rowBorderColorValue,
					},
				},
			},
			lastRowBorderBottomVisible: {
				'tbody tr:last-of-type td': {
					borderBottom: `1px solid ${rowBorderColorValue}`,
				},
			},
			textSelectionDisabled: {
				userSelect: 'none',
			},
			table: {
				borderCollapse: 'separate',
				borderSpacing: 0,
			},
			tableWithBorder: {
				border: `1px solid ${borderColorValue}`,
			},
			resizableColumnHeaderKnobTransparent: {
				[`& .${getStylesRef('resizableColumnHeaderKnob')}`]: {
					background: 'transparent',
				},
			},
			tableWithColumnBorders: {
				'&&': {
					'th, td': {
						':not(:first-of-type)': {
							borderLeft: `1px solid ${rowBorderColorValue}`,
						},
					},
				},
			},
			tableWithColumnBordersAndSelectableRecords: {
				thead: {
					'tr + tr': {
						th: {
							borderLeft: `1px solid ${rowBorderColorValue}`,
						},
					},
				},
			},
			verticalAlignmentTop: {
				td: {
					verticalAlign: 'top',
				},
			},
			verticalAlignmentBottom: {
				td: {
					verticalAlign: 'bottom',
				},
			},
			pinLastColumn: {
				'th:last-of-type, td:last-of-type': {
					position: 'sticky',
					right: 0,
					zIndex: 1,
					background: 'inherit',
					'&::after': {
						content: "''",
						position: 'absolute',
						top: 0,
						bottom: 0,
						width: theme.spacing.sm,
						background: `linear-gradient(to left, ${theme.fn.rgba(theme.black, shadowGradientAlpha)}, ${theme.fn.rgba(
							theme.black,
							0
						)}), linear-gradient(to left, ${theme.fn.rgba(theme.black, shadowGradientAlpha)}, ${theme.fn.rgba(
							theme.black,
							0
						)} 30%)`,
						borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
						left: -px(theme.spacing.sm),
						pointerEvents: 'none',
						opacity: 0,
						transition: `opacity 0.2s`,
					},
				},
			},
			pinnedColumnShadowVisible: {
				'th:last-of-type, td:last-of-type': {
					'&::after': {
						opacity: 1,
					},
				},
			},
		}
	}
)

export default function DataTable<T>({
	withBorder,
	borderRadius,
	borderColor = (theme) => (theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]),
	rowBorderColor = (theme) => theme.fn.rgba(theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3], 0.65),
	withColumnBorders,
	textSelectionDisabled,
	height = '100%',
	minHeight,
	shadow,
	verticalAlignment = 'center',
	fetching,
	columns,
	storeColumnsKey,
	groups,
	pinLastColumn,
	defaultColumnProps,
	defaultColumnRender,
	idAccessor = 'id',
	records,
	tableId, // MD
	parentTableItemId, // MD
	selectedRecords,
	onSelectedRecordsChange,
	isRecordSelectable,
	allRecordsSelectionCheckboxProps = { 'aria-label': 'Select all records' },
	getRecordSelectionCheckboxProps = (_, index) => ({ 'aria-label': `Select record ${index + 1}` }),
	sortStatus,
	sortIcons,
	onSortStatusChange,
	horizontalSpacing,
	page,
	onPageChange,
	totalRecords,
	recordsPerPage,
	onRecordsPerPageChange,
	recordsPerPageOptions,
	recordsPerPageLabel = 'Records per page',
	paginationColor,
	paginationSize = 'sm',
	paginationText = ({ from, to, totalRecords }) => `${from} - ${to} / ${totalRecords}`,
	paginationWrapBreakpoint = 'sm',
	getPaginationControlProps = (control) => {
		if (control === 'previous') {
			return { 'aria-label': 'Previous page' }
		} else if (control === 'next') {
			return { 'aria-label': 'Next page' }
		}
		return {}
	},
	loaderBackgroundBlur,
	customLoader,
	loaderSize,
	loaderVariant,
	loaderColor,
	loaderBgColor, // Rolder
	loaderOpacity, // Rolder
	loadingText = '...',
	emptyState,
	noRecordsText = 'No records',
	noRecordsIcon,
	striped,
	noHeader: withoutHeader,
	onRowClick,
	onCellClick,
	onScrollToTop,
	onScrollToBottom,
	onScrollToLeft,
	onScrollToRight,
	rowContextMenu,
	rowExpansion,
	rowClassName,
	rowStyle,
	rowSx,
	customRowAttributes,
	scrollViewportRef: scrollViewportRefProp,
	scrollAreaProps,
	bodyRef,
	m,
	my,
	mx,
	mt,
	mb,
	ml,
	mr,
	sx,
	className,
	classNames,
	style,
	styles,
	...otherProps
}: DataTableProps<T>) {
	const {
		ref: scrollViewportRef,
		width: scrollViewportWidth,
		height: scrollViewportHeight,
	} = useElementOuterSize<HTMLDivElement>()

	const effectiveColumns = useMemo(() => {
		return groups?.flatMap((group) => group.columns) ?? columns!
	}, [columns, groups])

	const dragToggle = useDataTableColumns({
		key: storeColumnsKey,
		columns: effectiveColumns,
	})

	const { ref: headerRef, height: headerHeight } = useElementOuterSize<HTMLTableSectionElement>()
	const { ref: tableRef, width: tableWidth, height: tableHeight } = useElementOuterSize<HTMLTableElement>()
	const { ref: footerRef, height: footerHeight } = useElementOuterSize<HTMLTableSectionElement>()
	const { ref: paginationRef, height: paginationHeight } = useElementOuterSize<HTMLDivElement>()

	const [scrolledToTop, setScrolledToTop] = useState(true)
	const [scrolledToBottom, setScrolledToBottom] = useState(true)
	const [scrolledToLeft, setScrolledToLeft] = useState(true)
	const [scrolledToRight, setScrolledToRight] = useState(true)

	const { rowContextMenuInfo, setRowContextMenuInfo } = useRowContextMenu<T>(fetching)
	const rowExpansionInfo = useRowExpansion<T>({ rowExpansion, records, idAccessor })

	const handleScrollPositionChange = useCallback(() => {
		if (!fetching && rowContextMenu) {
			setRowContextMenuInfo(null)
		}

		if (fetching || tableHeight <= scrollViewportHeight) {
			setScrolledToTop(true)
			setScrolledToBottom(true)
		} else {
			const scrollTop = scrollViewportRef.current.scrollTop
			const newScrolledToTop = scrollTop === 0
			const newScrolledToBottom = tableHeight - scrollTop - scrollViewportHeight < 1
			setScrolledToTop(newScrolledToTop)
			setScrolledToBottom(newScrolledToBottom)
			if (newScrolledToTop && newScrolledToTop !== scrolledToTop) onScrollToTop?.()
			if (newScrolledToBottom && newScrolledToBottom !== scrolledToBottom) onScrollToBottom?.()
		}

		if (fetching || tableWidth === scrollViewportWidth) {
			setScrolledToLeft(true)
			setScrolledToRight(true)
		} else {
			const scrollLeft = scrollViewportRef.current.scrollLeft
			const newScrolledToLeft = scrollLeft === 0
			const newScrolledToRight = tableWidth - scrollLeft - scrollViewportWidth < 1
			setScrolledToLeft(newScrolledToLeft)
			setScrolledToRight(newScrolledToRight)
			if (newScrolledToLeft && newScrolledToLeft !== scrolledToLeft) onScrollToLeft?.()
			if (newScrolledToRight && newScrolledToRight !== scrolledToRight) onScrollToRight?.()
		}
	}, [
		fetching,
		onScrollToBottom,
		onScrollToLeft,
		onScrollToRight,
		onScrollToTop,
		rowContextMenu,
		scrollViewportHeight,
		scrollViewportRef,
		scrollViewportWidth,
		scrolledToBottom,
		scrolledToLeft,
		scrolledToRight,
		scrolledToTop,
		setRowContextMenuInfo,
		tableHeight,
		tableWidth,
	])

	useIsomorphicLayoutEffect(handleScrollPositionChange, [handleScrollPositionChange])

	const handlePageChange = useCallback(
		(page: number) => {
			scrollViewportRef.current.scrollTo({ top: 0, left: 0 })
			onPageChange!(page)
		},
		[onPageChange, scrollViewportRef]
	)

	const recordsLength = records?.length
	const recordIds = records?.map((record) => getRecordId(record, idAccessor))
	const selectionColumnVisible = !!selectedRecords
	const selectedRecordIds = selectedRecords?.map((record) => getRecordId(record, idAccessor))
	const hasRecordsAndSelectedRecords = recordIds !== undefined && selectedRecordIds !== undefined && selectedRecordIds.length > 0

	const selectableRecords = isRecordSelectable ? records?.filter(isRecordSelectable) : records
	const selectableRecordIds = selectableRecords?.map((record) => getRecordId(record, idAccessor))

	const allSelectableRecordsSelected =
		hasRecordsAndSelectedRecords && selectableRecordIds!.every((id) => selectedRecordIds.includes(id))
	const someRecordsSelected = hasRecordsAndSelectedRecords && selectableRecordIds!.some((id) => selectedRecordIds.includes(id))

	//==========================================MD==============================================
	// Получаем store из своего provider
	const selectionScopeStore = useStore()

	// Получаем значения атомов из store без подписки на их изменения
	const tableSelectionScopeValue = selectionScopeStore.get(tableSelectionScopeAtom)
	const tableSelectionChildIdsByParentIdValue = selectionScopeStore.get(tableSelectionChildIdsByParentIdAtom) // setTableSelectionChildIdsByParentIdValue
	const tableSelectionScopeInternalValue = selectionScopeStore.get(tableSelectionScopeInternalAtom)
	const tableHandlerAtomValue = selectionScopeStore.get(tableHandlerAtom)

	// Задаем функции, по перезаписыванию значений в атомах данного store
	const setTableSelectionScopeValue = (value: TableSelectionScopeValues) => {
		selectionScopeStore.set(tableSelectionScopeAtom, value)
	}
	const setTableSelectionClickItemIdValue = (value: string[]) => {
		selectionScopeStore.set(tableSelectionClickItemIdAtom, value)
	}
	const setTableSelectionScopeInternalValue = (value: TableSelectionScopeInternal) => {
		selectionScopeStore.set(tableSelectionScopeInternalAtom, value)
	}

	// Функция для запуска перерендера tableSelectionScope
	function runTableSelectionScope() {
		// Вызываем перерендер tableSelectionScope, чтобы он пересчитал
		// статусы связанных записей и обновил необходимые таблицы
		try {
			tableHandlerAtomValue['selectionScope']()
		} catch (e) {
			console.error('У таблиц включен expension и multiselect, но они не оборнуты в selectionScope!')
			console.error('Разместите иерархичные таблицы под нодой tableSelectionScope!!!')
			console.error(e)
		}
	}

	// Проверим, включены ли expansion и multiselect и нужно ли брать состояния из scope
	const useScopeStates = rowExpansion !== undefined && selectionColumnVisible

	// Если хоть одна запись таблицы indeterminated, то отображаем
	const tableIsIndeterminated = records
		? tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].find((indItem) =>
				records.find((record) => getRecordId(record, idAccessor) === indItem)
			)
			? true
			: false
		: false

	//==========================================================================================

	const handleHeaderSelectionChange = useCallback(() => {
		if (selectedRecords && onSelectedRecordsChange) {
			// Если все записи выбраны, то снимаем все
			if (allSelectableRecordsSelected) {
				// MD
				// Если включены expension и multiSelection
				if (useScopeStates && typeof parentTableItemId === 'string') {
					// Сменим статусы всех элементов 1 уровня и запишем их в массив измененных
					const firstLevelItems = tableSelectionChildIdsByParentIdValue['root']
					firstLevelItems?.forEach((itemId) => {
						tableSelectionScopeValue[itemId] = 'notSelected'
					})
					// Запишем в массив на рендер id родительского элемента
					if (firstLevelItems) setTableSelectionClickItemIdValue(firstLevelItems)
				}
				onSelectedRecordsChange(
					selectedRecords.filter((record) => !selectableRecordIds!.includes(getRecordId(record, idAccessor)))
				)
			}
			// Если все записи не выбраны, то выбираем
			else {
				// Если включены expension и multiSelection
				if (useScopeStates && typeof parentTableItemId === 'string') {
					// Сменим статусы всех элементов 1 уровня и запишем их в массив измененных
					const firstLevelItems = tableSelectionChildIdsByParentIdValue['root']
					firstLevelItems?.forEach((itemId) => {
						tableSelectionScopeValue[itemId] = 'selected'
					})
					// Запишем в массив на рендер id родительского элемента
					if (firstLevelItems) setTableSelectionClickItemIdValue(firstLevelItems)
				}
				if (records)
					onSelectedRecordsChange(
						uniqBy([...selectedRecords, ...selectableRecords!], (record) => getRecordId(record, idAccessor))
					)
			}
			// Запускаем tableSelectionScope
			if (useScopeStates) {
				runTableSelectionScope()
				setTableSelectionScopeValue(tableSelectionScopeValue)
				setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)
			}
		}
	}, [allSelectableRecordsSelected, idAccessor, onSelectedRecordsChange, selectableRecordIds, selectableRecords, selectedRecords])

	const { lastSelectionChangeIndex, setLastSelectionChangeIndex } = useLastSelectionChangeIndex(recordIds)
	const selectionVisibleAndNotScrolledToLeft = selectionColumnVisible && !scrolledToLeft

	const { cx, classes, theme } = useStyles({ borderColor, rowBorderColor })
	const marginProperties = { m, my, mx, mt, mb, ml, mr }
	const styleProperties = typeof styles === 'function' ? styles(theme, EMPTY_OBJECT, EMPTY_OBJECT) : styles

	return (
		<DataTableDragToggleColumnsProvider {...dragToggle}>
			<Box
				{...marginProperties}
				className={cx(
					classes.root,
					{
						[classes.tableWithBorder]: withBorder,
						[classes.resizableColumnHeaderKnobTransparent]: withColumnBorders,
					},
					className,
					classNames?.root
				)}
				sx={[
					(theme) => ({
						borderRadius: theme.radius[borderRadius as MantineSize] || borderRadius,
						boxShadow: theme.shadows[shadow as MantineSize] || shadow,
						height,
						minHeight,
					}),
					...packSx(sx),
				]}
				style={{ ...styleProperties?.root, ...style } as CSSProperties}
			>
				<DataTableScrollArea
					viewportRef={useMergedRef(scrollViewportRef, scrollViewportRefProp || null)}
					topShadowVisible={!scrolledToTop}
					leftShadowVisible={!(selectedRecords || scrolledToLeft)}
					rightShadowVisible={!scrolledToRight && !pinLastColumn}
					bottomShadowVisible={!scrolledToBottom}
					headerHeight={headerHeight}
					footerHeight={footerHeight}
					onScrollPositionChange={handleScrollPositionChange}
					scrollAreaProps={scrollAreaProps}
				>
					<Table
						ref={tableRef}
						horizontalSpacing={horizontalSpacing}
						className={cx(classes.table, {
							[classes.tableWithColumnBorders]: withColumnBorders,
							[classes.lastRowBorderBottomVisible]: tableHeight < scrollViewportHeight,
							[classes.textSelectionDisabled]: textSelectionDisabled,
							[classes.verticalAlignmentTop]: verticalAlignment === 'top',
							[classes.verticalAlignmentBottom]: verticalAlignment === 'bottom',
							[classes.tableWithColumnBordersAndSelectableRecords]: selectionColumnVisible && withColumnBorders,
							[classes.pinLastColumn]: pinLastColumn,
							[classes.pinnedColumnShadowVisible]: pinLastColumn && !scrolledToRight,
						})}
						striped={recordsLength ? striped : false}
						{...otherProps}
					>
						{withoutHeader ? null : (
							<DataTableHeader<T>
								ref={headerRef}
								className={classNames?.header}
								style={styleProperties?.header}
								columns={effectiveColumns}
								defaultColumnProps={defaultColumnProps}
								groups={groups}
								sortStatus={sortStatus}
								sortIcons={sortIcons}
								onSortStatusChange={onSortStatusChange}
								selectionVisible={selectionColumnVisible}
								selectionChecked={allSelectableRecordsSelected}
								selectionIndeterminate={(someRecordsSelected && !allSelectableRecordsSelected) || tableIsIndeterminated}
								onSelectionChange={handleHeaderSelectionChange}
								selectionCheckboxProps={allRecordsSelectionCheckboxProps}
								leftShadowVisible={selectionVisibleAndNotScrolledToLeft}
							/>
						)}
						<tbody ref={bodyRef}>
							{recordsLength ? (
								records.map((record, recordIndex) => {
									const recordId = getRecordId(record, idAccessor)
									const isSelected = selectedRecordIds?.includes(recordId) || false
									const isIndeterminated =
										typeof recordId === 'string'
											? tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList']?.includes(recordId)
											: false

									let showContextMenuOnClick = false
									let showContextMenuOnRightClick = false
									if (rowContextMenu) {
										const { hidden } = rowContextMenu
										if (!hidden || !(typeof hidden === 'function' ? hidden(record, recordIndex) : hidden)) {
											if (rowContextMenu.trigger === 'click') {
												showContextMenuOnClick = true
											} else {
												showContextMenuOnRightClick = true
											}
										}
									}

									let handleSelectionChange: ChangeEventHandler<HTMLInputElement> | undefined
									if (onSelectedRecordsChange && selectedRecords) {
										handleSelectionChange = (e) => {
											if ((e.nativeEvent as PointerEvent).shiftKey && lastSelectionChangeIndex !== null) {
												const targetRecords = records.filter(
													recordIndex > lastSelectionChangeIndex
														? (r, index) =>
																index >= lastSelectionChangeIndex &&
																index <= recordIndex &&
																(isRecordSelectable ? isRecordSelectable(r, index) : true)
														: (r, index) =>
																index >= recordIndex &&
																index <= lastSelectionChangeIndex &&
																(isRecordSelectable ? isRecordSelectable(r, index) : true)
												)
												onSelectedRecordsChange(
													isSelected
														? differenceBy(selectedRecords, targetRecords, (r) => getRecordId(r, idAccessor))
														: uniqBy([...selectedRecords, ...targetRecords], (r) => getRecordId(r, idAccessor))
												)
											} else {
												if (isSelected) {
													// MD
													if (useScopeStates && typeof recordId === 'string') {
														tableSelectionScopeValue[recordId] = 'notSelected'
														// Если запись в массиве indeterminated, то удаляем из него
														if (
															tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList']?.find(
																(itemId) => itemId === recordId
															)
														) {
															tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].filter(
																(itemId) => itemId !== recordId
															)
														}
													}
													// Обновляем массив выбранных
													onSelectedRecordsChange(
														selectedRecords.filter((record) => getRecordId(record, idAccessor) !== recordId)
													)
												}
												// Если запись не выбрана, то делаем выбранной
												else {
													if (useScopeStates && typeof recordId === 'string') {
														tableSelectionScopeValue[recordId] = 'selected'
														// Если запись в массиве indeterminated, то удаляем из него
														if (
															tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList']?.find(
																(itemId) => itemId === recordId
															)
														) {
															tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'].filter(
																(itemId) => itemId !== recordId
															)
														}
													}
													// Обновляем массив выбранных
													onSelectedRecordsChange(
														uniqBy([...selectedRecords, record], (record) => getRecordId(record, idAccessor))
													)
												}
												// Если включен и expension и multiselect
												if (useScopeStates) {
													// Запишем в массив на рендер id родительской и дочерней таблицы
													if (typeof recordId === 'string') setTableSelectionClickItemIdValue([recordId])
													setTableSelectionScopeValue(tableSelectionScopeValue)
													setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)
													// Запускаем tableSelectionScope
													runTableSelectionScope()
												}
											}
											setLastSelectionChangeIndex(recordIndex)
										}
									}

									let handleClick: MouseEventHandler<HTMLTableRowElement> | undefined
									if (showContextMenuOnClick) {
										handleClick = (e) => {
											setRowContextMenuInfo({ y: e.clientY, x: e.clientX, record, recordIndex })
											onRowClick?.(record, recordIndex, e)
										}
									} else if (onRowClick) {
										handleClick = (e) => {
											onRowClick(record, recordIndex, e)
										}
									}

									let handleContextMenu: MouseEventHandler<HTMLTableRowElement> | undefined
									if (showContextMenuOnRightClick) {
										handleContextMenu = (e) => {
											e.preventDefault()
											setRowContextMenuInfo({ y: e.clientY, x: e.clientX, record, recordIndex })
										}
									}

									return (
										<DataTableRow<T>
											key={recordId as Key}
											record={record}
											recordIndex={recordIndex}
											columns={effectiveColumns}
											defaultColumnProps={defaultColumnProps}
											defaultColumnRender={defaultColumnRender}
											selectionVisible={selectionColumnVisible}
											selectionChecked={isSelected}
											selectionIndeterminate={isIndeterminated} // MD
											onSelectionChange={handleSelectionChange}
											isRecordSelectable={isRecordSelectable}
											getSelectionCheckboxProps={getRecordSelectionCheckboxProps}
											onClick={handleClick}
											onCellClick={onCellClick}
											onContextMenu={handleContextMenu}
											contextMenuVisible={
												rowContextMenuInfo ? getRecordId(rowContextMenuInfo.record, idAccessor) === recordId : false
											}
											expansion={rowExpansionInfo}
											className={rowClassName}
											style={rowStyle}
											sx={rowSx}
											customAttributes={customRowAttributes}
											leftShadowVisible={selectionVisibleAndNotScrolledToLeft}
										/>
									)
								})
							) : (
								<DataTableEmptyRow />
							)}
						</tbody>
						{effectiveColumns.some(({ footer }) => footer) && (
							<DataTableFooter<T>
								ref={footerRef}
								className={classNames?.footer}
								style={styleProperties?.footer}
								borderColor={borderColor}
								columns={effectiveColumns}
								defaultColumnProps={defaultColumnProps}
								selectionVisible={selectionColumnVisible}
								leftShadowVisible={selectionVisibleAndNotScrolledToLeft}
								scrollDiff={tableHeight - scrollViewportHeight}
							/>
						)}
					</Table>
				</DataTableScrollArea>
				{page && (
					<DataTablePagination
						ref={paginationRef}
						className={classNames?.pagination}
						style={styleProperties?.pagination}
						topBorderColor={borderColor}
						horizontalSpacing={horizontalSpacing}
						fetching={fetching}
						page={page}
						onPageChange={handlePageChange}
						totalRecords={totalRecords}
						recordsPerPage={recordsPerPage}
						onRecordsPerPageChange={onRecordsPerPageChange}
						recordsPerPageOptions={recordsPerPageOptions}
						recordsPerPageLabel={recordsPerPageLabel}
						paginationColor={paginationColor}
						paginationSize={paginationSize}
						paginationText={paginationText}
						paginationWrapBreakpoint={paginationWrapBreakpoint}
						getPaginationControlProps={getPaginationControlProps}
						noRecordsText={noRecordsText}
						loadingText={loadingText}
						recordsLength={recordsLength}
					/>
				)}
				<DataTableLoader
					pt={headerHeight}
					pb={paginationHeight}
					fetching={fetching}
					backgroundBlur={loaderBackgroundBlur}
					customContent={customLoader}
					size={loaderSize}
					variant={loaderVariant}
					color={loaderColor}
					bgColor={loaderBgColor} // Rolder
					opacity={loaderOpacity} // Rolder
				/>
				<DataTableEmptyState
					pt={headerHeight}
					pb={paginationHeight}
					icon={noRecordsIcon}
					text={noRecordsText}
					active={!fetching && !recordsLength}
				>
					{emptyState}
				</DataTableEmptyState>
				{rowContextMenu && rowContextMenuInfo && (
					<Portal>
						<DataTableRowMenu
							zIndex={rowContextMenu.zIndex}
							borderRadius={rowContextMenu.borderRadius}
							shadow={rowContextMenu.shadow}
							y={rowContextMenuInfo.y}
							x={rowContextMenuInfo.x}
							onDestroy={() => setRowContextMenuInfo(null)}
						>
							{rowContextMenu
								.items(rowContextMenuInfo.record, rowContextMenuInfo.recordIndex)
								.map(({ divider, key, title, icon, color, hidden, disabled, onClick }) =>
									divider ? (
										<DataTableRowMenuDivider key={key} />
									) : hidden ? null : (
										<DataTableRowMenuItem
											key={key}
											title={title ?? humanize(key)}
											icon={icon}
											color={color}
											disabled={disabled}
											onClick={() => {
												setRowContextMenuInfo(null)
												onClick()
											}}
										/>
									)
								)}
						</DataTableRowMenu>
					</Portal>
				)}
			</Box>
		</DataTableDragToggleColumnsProvider>
	)
}

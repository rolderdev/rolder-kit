import type { FilterState } from '@nodes/table-filter-v0.1.0'
import type { NoodlNode } from '@shared/node-v1.0.0'
import type { DataTableProps, DataTableSortStatus } from 'mantine-datatable'
import type { Props } from '../node/definition'
import { type Column, setColumns } from './models/column'
import { setExpandedIds } from './models/expansion'
import { handleFilters, setInitialFiltersState } from './models/filter'
import { type HierarchyState, setHierarchyState } from './models/hierarchy'
import { type LibProps, setLibProps } from './models/libProps'
import { setCheckboxProps, setSelectedIds } from './models/multiSelection'
import { type TableRecord, itemIdsChanged, itemsOrderChanged, setOriginalIds, setRecordIds } from './models/record'
import { type Row, setRowPaddingLeft } from './models/row'
import { setSelectedId } from './models/singleSelection'
import { setSortState } from './models/sort'
import { type TableProps, setTableProps } from './models/tableProps'

export type Store = {
	// Base
	noodlNode: NoodlNode
	tableId: string
	columns: Record<string, Column>
	fetching: boolean
	records: TableRecord[]
	originalIds: string[]
	libProps: LibProps
	tableProps: TableProps
	funcs: Funcs
	header: Row
	rows: Record<string, Row>
	selectedId: string | null
	selectedIds: Record<string, boolean>
	sort: { state?: DataTableSortStatus<TableRecord>; hierarchyUnsub?: () => void }
	filters: { states: Record<string, FilterState>; inited: Record<string, boolean> }
	expandedIds: Record<string, boolean>
	expandedIdsArr: string[]
	hierarchy?: HierarchyState
	usedDefsults: { singleSelection?: boolean; multiSelection?: boolean; expansion?: boolean }
}

export type Funcs = Pick<
	Props,
	'clickFilterFunc' | 'paddingLeftFunc' | 'singleSelectionFilterFunc' | 'multiSelectionFilterFunc' | 'expansionFilterFunc'
> & { getRecordSelectionCheckboxProps?: DataTableProps<TableRecord>['getRecordSelectionCheckboxProps'] }

// Просто глобальное хранилище, отличабщее одну таблицу от другой по id.
const stores: Record<string, Store> = {}

// Функция подготовки store при каждой подаче props.
export const handleStore = (p: Props, tableId: string) => {
	// Инициализация.
	if (!stores[tableId]) {
		const { proxy, ref } = R.libs.valtio

		// Создадим реактивное хранилище. Записываем только раз, чтобы обеспечить точечную реактивность на изменения в хранилище.
		stores[tableId] = proxy<Store>({
			noodlNode: ref(p.noodlNode), // Нужно запретить переделывать в proxy.
			tableId,
			columns: {},
			fetching: p.fetching,
			records: [],
			originalIds: [],
			libProps: {} as LibProps,
			tableProps: {} as TableProps,
			funcs: {},
			header: {},
			rows: {},
			selectedId: null,
			selectedIds: {},
			sort: {},
			filters: { states: {}, inited: {} },
			expandedIds: {},
			expandedIdsArr: [],
			usedDefsults: {},
		})
	}

	// Реактивность на изменение props и процесс их зависимой обработки.
	const s = stores[tableId]
	// Везде props и store. Props - источник изменений, store - результат вычислений, в том числе и предыдущего шага.
	// Весь процесс запускается при любой подачи props (даже не измененных).
	// На каждом этапе можно оптимизировать процесс, сравнивая props с данными в store.
	setHierarchyState(p, s) // Первым, т.к. все остальное сильно зависит от того в составе ли иерархии эта таблица.
	setLibProps(p, s) // Настройки библиотеки.
	setTableProps(p, s) // Настройки наших надстроек над библиотекой.
	setColumns(p, s) // Преобразование декларации колонки в вид, который может корректно принять библиотека.
	setRecordIds(p, s) // Преобразвание items в records, т.е. пустые объекты с id.

	// Флаги изменений items.
	const idsChanged = itemIdsChanged(p, s)
	const orderChanged = itemsOrderChanged(p, s)

	// Запись кеша - originalIds для последующих фронтовых сортировок и фильтраций.
	if (idsChanged || orderChanged) {
		setOriginalIds(p, s)
		handleFilters(s)
	}

	// Функции нужно обрабатывать отедльно, т.к. Valtio не умеет их сравнивать.
	const compare = R.libs.just.compare
	if (!compare(p.clickFilterFunc, s.funcs.clickFilterFunc)) s.funcs.clickFilterFunc = p.clickFilterFunc
	if (!compare(p.singleSelectionFilterFunc, s.funcs.singleSelectionFilterFunc))
		s.funcs.singleSelectionFilterFunc = p.singleSelectionFilterFunc
	if (!compare(p.multiSelectionFilterFunc, s.funcs.multiSelectionFilterFunc))
		s.funcs.multiSelectionFilterFunc = p.multiSelectionFilterFunc
	if (!compare(p.expansionFilterFunc, s.funcs.expansionFilterFunc)) s.funcs.expansionFilterFunc = p.expansionFilterFunc

	// Дефолты.
	// Единичный выбор.
	if (!s.usedDefsults.singleSelection && p.items?.length) {
		const defaultSelectedItemId = p.defaultSelectedItem?.id || s.hierarchy?.tableNode?.states.singleSelection.value
		if (defaultSelectedItemId) setSelectedId(s, defaultSelectedItemId)
	}

	// Мультивыбор.
	if (!s.usedDefsults.multiSelection && p.items?.length) {
		// В дефолт тянем сначал подданные прямо, потом из иерархии (иначе useHierarchySelection проставляет выделение после отрисовки таблицы).
		const defaultSelectedRecords =
			p.defaultSelectedItems?.map((item) => ({ id: item.id })) || s.hierarchy?.tableNode?.multiSelected() || []
		if (defaultSelectedRecords.length) setSelectedIds(s, defaultSelectedRecords)
	}

	// Сортировка.
	if (s.tableProps.sort.enabled && s.tableProps.sort.defaultState && p.items?.length)
		setSortState(s, s.sort.state || s.tableProps.sort.defaultState, true)

	// Фильтрация.
	if (idsChanged) setInitialFiltersState(s)

	// Разворачивание.
	if (!s.usedDefsults.expansion && p.items?.length) {
		const defaultExpandedIds =
			p.defaultExpandedItems?.map((item) => item.id) ||
			s.hierarchy?.tableNode
				?.expanded()
				.filter((i) => !!i)
				.map((i) => i.id) ||
			[]
		if (defaultExpandedIds.length) setExpandedIds(s, defaultExpandedIds, true)
	}

	// Настройки строк. Заполняется реактивное хранилище s.rows, которое потом испольуется точечно - для каждой строки.
	// Установка настроек чекбоксов.
	const checkBoxPropsChanged = setCheckboxProps(p, s, idsChanged)
	// Установка отступа функцией разработчика.
	setRowPaddingLeft(p, s, idsChanged, checkBoxPropsChanged)

	s.fetching = p.fetching // В конце, чтобы анимация загрузки исчезала после полной готовности.

	return s
}

// Обертка, для удобного вытягивания хранилища по id таблицы.
export const useStore = (tableId: string) => stores[tableId]

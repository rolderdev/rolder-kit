import type { NoodlNode } from '@shared/node-v1.0.0'
import type { Props } from '../node/definition'
import { setLibProps, type LibProps } from './models/libProps'
import { setTableProps, type TableProps } from './models/tableProps'
import { setColumns, type Column } from './models/column'
import { itemIdsChanged, itemsOrderChanged, setOriginalIds, setRecordIds, type TableRecord } from './models/record'
import type { DataTableSortStatus } from 'mantine-datatable'
import { setHierarchyState, type HierarchyState } from './models/hierarchy'
import type { CheckboxProps } from '@mantine/core'
import type { FilterState } from '@nodes/table-filter-v0.1.0'
import { setSortState } from './models/sort'
import { setSelectedIds } from './models/multiSelection'
import { setRowPaddingLeft, type Row } from './models/row'

// export default (noodlNode: NoodlNode) => {
// 	const { proxy, ref } = R.libs.valtio

// 	return proxy<Store>({
// 		noodlNode: ref(noodlNode),
// 		inited: false,
// 		//hierarchy: { isChild: false, level: 0 },
// 		fetching: true,
// 		// libProps: {} as LibProps,
// 		// tableProps: {} as TableProps,
// 		// columnsDefinition: {},
// 		// records: [],
// 		// originalIds: [],
// 		// selectedId: null,
// 		// selectedIds: {},
// 		// checkboxes: { unsubs: {}, props: {}, hasChildren: {} },
// 		// expandedIds: {},
// 		// sort: {},
// 		// filters: {},
// 	})
// }

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
	rows: Record<string, Row>
	selectedId: string | null
	selectedIds: Record<string, boolean>
	checkboxes: {
		hierarchyUnsubs: { [id: string]: () => void }
		props: { [id: string]: CheckboxProps }
		hasChildren: { [id: string]: boolean }
	}
	sort: { state?: DataTableSortStatus<TableRecord>; hierarchyUnsub?: () => void }
	filters: { state?: Record<string, FilterState>; hierarchyUnsub?: () => void }
	expandedIds: Record<string, boolean>
	expandedIdsArr: string[]
	hierarchy?: HierarchyState
}

export type Funcs = Pick<
	Props,
	'clickFilterFunc' | 'paddingLeftFunc' | 'singleSelectionFilterFunc' | 'multiSelectionFilterFunc' | 'expansionFilterFunc'
>

//export type Snap = Readonly<Store>

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
			rows: {},
			selectedId: null,
			selectedIds: {},
			checkboxes: { hierarchyUnsubs: {}, props: {}, hasChildren: {} },
			sort: {},
			filters: {},
			expandedIds: {},
			expandedIdsArr: [],
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
	if (idsChanged || orderChanged) setOriginalIds(p, s)

	// Функции нужно обрабатывать отедльно, т.к. Valtio не умеет их сравнивать.
	const compare = R.libs.just.compare
	if (!compare(p.clickFilterFunc, s.funcs.clickFilterFunc)) s.funcs.clickFilterFunc = p.clickFilterFunc
	if (!compare(p.singleSelectionFilterFunc, s.funcs.singleSelectionFilterFunc))
		s.funcs.singleSelectionFilterFunc = p.singleSelectionFilterFunc
	if (!compare(p.multiSelectionFilterFunc, s.funcs.multiSelectionFilterFunc))
		s.funcs.multiSelectionFilterFunc = p.multiSelectionFilterFunc
	if (!compare(p.expansionFilterFunc, s.funcs.expansionFilterFunc)) s.funcs.expansionFilterFunc = p.expansionFilterFunc

	// Дефолты.
	// Мультивыбор.
	// const defaultSelectedRecords = p.defaultSelectedItems?.map((item) => ({ id: item.id })) || []
	// if (defaultSelectedRecords.length) setSelectedIds(s, defaultSelectedRecords, true)
	// Сортировка.
	if (s.tableProps.sort.enabled && s.tableProps.sort.defaultState && p.items?.length)
		setSortState(s, s.sort.state || s.tableProps.sort.defaultState, true)

	// Установка отступа функцией разработчика.
	setRowPaddingLeft(p, s, idsChanged)

	s.fetching = p.fetching // В конце, чтобы анимация загрузки исчезала после полной готовности.
}

// Обертка, для удобного вытягивания хранилища по id таблицы.
export const useStore = (tableId: string) => stores[tableId]

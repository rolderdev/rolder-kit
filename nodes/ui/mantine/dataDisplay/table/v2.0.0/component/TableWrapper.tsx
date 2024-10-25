/* Обертка для таблицы. Готовит все для таблицы по данным, что прилетают извне - props, сигналы, изменения в иерархии useData. */

import { forwardRef, useMemo } from 'react'
import type { Props } from '../node/definition'
import { handleStore } from './store'
import Table from './Table'

// Стили библиотеки.
import 'mantine-datatable/styles.css'

export default forwardRef((p: Props, ref) => {
	// Создадим id таблицы, сохранив его одним для всего жизненного цикла.
	const tableId = useMemo(() => R.libs.nanoid(8), [])

	// Создадим/обновим реактивное хранилище.
	handleStore(p, tableId)

	console.log('Table wrapper', tableId)
	// Wrapper запускается на каждый чих. Table обернут в memo и берет только tableId.
	// Это означает, что таблица не реагирует на прилетающие props.
	return <Table tableId={tableId} />
})

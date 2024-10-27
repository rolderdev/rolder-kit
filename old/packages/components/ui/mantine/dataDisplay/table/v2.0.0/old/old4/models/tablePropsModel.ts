/* Модель настроек таблицы. */

import { z } from 'zod'
import type { Props } from '../../types'

// Схема задает типы данных и их дефолты.
const tablePropsSchema = z.object({
	//customProps: t.frozen(),
	// Base
	onRowClick: z.enum(['disabled', 'signal', 'function', 'singleSelection', 'expansion']),
	//isParentTable: z.boolean().default(false),
	//renderDelay: t.number,
	// Dimensions
	/* expansion: t.model('Expansion', {
		enabled: false,
		template: '',
		allowMultiple: false,
		// Если не настроить здесь реактивность, появится лишний рендер.
		collapseProps: t.model({ transitionDuration: 150, transitionTimingFunction: 'ease', animateOpacity: true })
	}) */
})

type TableProps = z.infer<typeof tablePropsSchema>

// Функция проверяет прилетевшие знаяения с портов и восстаналвивает дефолты, если значение не прилетело.
const getTableProps = (p: Props) => tablePropsSchema.parse(p)

export { tablePropsSchema, getTableProps, type TableProps }

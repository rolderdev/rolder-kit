/* Модель настроек библиотеки. */

import { z } from 'zod'
import type { Props } from '../../types'

// Схема задает типы данных и их дефолты.
const libPropsSchema = z.object({
	// Base
	textSelectionDisabled: z.boolean().default(false),
	// Layout
	noHeader: z.boolean().default(false),
	// Dimensions
	minHeight: z.string().default('84px'),
	horizontalSpacing: z.string().default('sm'),
	verticalSpacing: z.string().default('xs'),
	fz: z.string().default('sm'),
	// Table styles
	shadow: z.string().default('sm'),
	withTableBorder: z.boolean().default(false),
	borderRadius: z.string().default('md'),
	withColumnBorders: z.boolean().default(false),
	emptyState: z.string().default('Записей не найдено'),
	// Row styles
	withRowBorders: z.boolean().default(true),
	striped: z.boolean().default(false),
	stripedColor: z.string().default('gray.0'),
	highlightOnHover: z.boolean().default(false).default(false),
	highlightOnHoverColor: z.string().default('gray.1'),
	// Loader styles
	loaderSize: z.string().default('lg'),
	loaderType: z.string().default('dots'),
	loaderColor: z.string().default('blue'),
	loaderBackgroundBlur: z.number().default(0.5),
})

type LibProps = z.infer<typeof libPropsSchema>

// Функция проверяет прилетевшие знаяения с портов и восстаналвивает дефолты, если значение не прилетело.
const getLibProps = (p: Props) => libPropsSchema.parse(p)

export { getLibProps, type LibProps }

/* Модель настроек библиотеки. */

import { type Instance, t } from 'mobx-state-tree'
import type { Props } from '../../types'

interface LibProps extends Instance<typeof libPropsModel> {}

// Модель задает типы данных (infer) через установку дефолтного значения.
const libPropsModel = t.model('libProps', {
	// Base
	textSelectionDisabled: false,
	// Layout
	noHeader: false,
	// Dimensions
	minHeight: '84px',
	horizontalSpacing: 'sm',
	verticalSpacing: 'xs',
	fz: 'sm',
	// Table styles
	shadow: 'sm',
	withTableBorder: false,
	borderRadius: 'md',
	withColumnBorders: false,
	emptyState: 'Записей не найдено',
	// Row styles
	withRowBorders: true,
	striped: false,
	stripedColor: 'gray.0',
	highlightOnHover: false,
	highlightOnHoverColor: 'gray.1',
	// Loader styles
	loaderSize: 'lg',
	loaderType: 'dots',
	loaderColor: 'blue',
	loaderBackgroundBlur: 0.5,
})

// Функция устанавливает прилетевшие с портов значения и восстаналвивает дефолты, если значение не прилетело.
// Используется функция, а не action, т.к. она нужна еще до инициализации модели
function getLibProps(p: Props): LibProps {
	return {
		// Base
		textSelectionDisabled: p.textSelectionDisabled || false,
		// Layout
		noHeader: p.noHeader,
		// Dimensions
		minHeight: p.minHeight || '84px',
		horizontalSpacing: p.horizontalSpacing || 'sm',
		verticalSpacing: p.verticalSpacing || 'xs',
		fz: p.fz || 'sm',
		// Table styles
		shadow: p.isParentTable ? 'none' : p.shadow || 'sm',
		withTableBorder: p.withTableBorder || false,
		borderRadius: p.isParentTable ? '0px' : p.borderRadius || 'md',
		withColumnBorders: p.withColumnBorders || false,
		emptyState: 'Записей не найдено',
		// Row styles
		withRowBorders: p.withRowBorders === undefined ? true : p.withRowBorders,
		striped: p.striped || false,
		stripedColor: p.striped ? p.stripedColor || 'gray.0' : 'white', // white отключает наследование
		highlightOnHover: p.highlightOnHover || false,
		highlightOnHoverColor: p.highlightOnHover ? p.highlightOnHoverColor || 'gray.1' : 'white', // white отключает наследование
		// Loader styles
		loaderSize: p.customProps?.loader?.size || 'lg',
		loaderType: p.customProps?.loader?.type || 'dots',
		loaderColor: p.loaderColor || 'blue',
		loaderBackgroundBlur: p.customProps?.loader?.bgBlur || 0.5,
	}
}

export { libPropsModel, getLibProps, type LibProps }

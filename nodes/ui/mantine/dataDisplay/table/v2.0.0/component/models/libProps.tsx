/* Модель настроек библиотеки. */

import type { Props } from '../../node/definition'
import type { Store } from '../store'

export type LibProps = ReturnType<typeof setLibProps>

// Устанавливает настройки библиотеки. В итоговых данных не должно быть функций.
export const setLibProps = (p: Props, s: Store) => {
	const libProps = {
		...R.libs.just.pick(p, [
			// Base
			'textSelectionDisabled',
			// Layout
			'noHeader',
			// Table styles
			'withTableBorder',
			'withColumnBorders',
			// Row styles
			'withRowBorders',
			'striped',
			'highlightOnHover',
		]),
		// Dimensions
		minHeight: p.minHeight || '84px',
		horizontalSpacing: p.horizontalSpacing || 'sm',
		// Если 'xxs', то undefined, что равно минимальному дефолту таблицы в 7px.
		verticalSpacing: p.verticalSpacing === 'xxs' ? undefined : p.verticalSpacing || 'xs',
		fz: p.fz || 'sm',
		// Table styles
		shadow: s.hierarchy?.isChild ? 'none' : p.shadow || 'sm', // Если таблица дочерняя, убираем тень
		borderRadius: s.hierarchy?.isChild ? '0px' : p.borderRadius || 'md', // и округление.
		emptyState: 'Записей не найдено',
		// Row styles
		stripedColor: p.stripedColor || 'white', // Нужно перезаписать, иначе наследуется с родительской таблицы.
		highlightOnHoverColor: p.highlightOnHover ? p.highlightOnHoverColor : 'white',
		// Loader styles
		loaderSize: 'lg',
		loaderType: 'dots',
		loaderColor: p.loaderColor || 'blue',
		loaderBackgroundBlur: 0.5,
		// Multi selection
		allRecordsSelectionCheckboxProps: p.customProps?.allRecordsSelectionCheckboxProps,
		// Позволим разработчику рискнуть, но уберем функции, чтобы хранилище оставлось точечно реактивным.
		...(p.customProps ? R.libs.just.omit(p.customProps, ['getRecordSelectionCheckboxProps']) : {}),
	}

	s.libProps = libProps

	return libProps // Только для типизации.
}

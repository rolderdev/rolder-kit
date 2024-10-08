/* Модель настроек библиотеки. */

import type { Props } from '../../node/definition';
import type { Store } from '../store';

export type LibProps = ReturnType<typeof setLibProps>;

// Устанавливает настройки библиотеки.
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
		verticalSpacing: p.verticalSpacing || 'xs',
		fz: p.fz || 'sm',
		// Table styles
		shadow: s.hierarchy.isChild ? 'none' : p.shadow || 'sm', // Если таблица дочерняя, убираем тень
		borderRadius: s.hierarchy.isChild ? '0px' : p.borderRadius || 'md', // и округление.
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
		allRecordsSelectionCheckboxPropsDev: p.customProps?.allRecordsSelectionCheckboxProps,
		// Позволим разработчику рискнуть.
		...p.customProps,
	};

	s.libProps = libProps;
	return libProps; // Только для типизации.
};

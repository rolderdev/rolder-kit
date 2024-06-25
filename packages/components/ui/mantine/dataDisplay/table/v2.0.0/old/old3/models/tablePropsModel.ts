/* Модель настроек таблицы. */

import { t, type Instance } from 'mobx-state-tree';
import type { Props } from '../../types';

interface TableProps extends Instance<typeof tablePropsModel> {}

const tablePropsModel = t.model('Table', {
	customProps: t.frozen(),
	// Base
	onRowClick: t.enumeration(['disabled', 'signal', 'function', 'singleSelection', 'expansion']),
	isParentTable: false,
	renderDelay: t.number,
	// Dimensions
	expansion: t.model('Expansion', {
		enabled: false,
		template: '',
		allowMultiple: false,
		// Если не настроить здесь реактивность, появится лишний рендер.
		collapseProps: t.model({ transitionDuration: 150, transitionTimingFunction: 'ease', animateOpacity: true })
	})
});

// Функция устанавливает прилетевшие с портов значения и восстаналвивает дефолты, если значение не прилетело.
// Используется функция, а не action, т.к. она нужна еще до инициализации модели
function getTableProps(p: Props): TableProps {
	const tableProps: TableProps = {
		customProps: p.customProps,
		onRowClick: p.onRowClick,
		isParentTable: p.isParentTable || false,
		renderDelay: p.renderDelay || 1,
		expansion: {
			enabled: p.expansion || false,
			template: p.expansionTemplate,
			allowMultiple: p.allowMultiple || false,
			// Так можно взять дефолт и модели
			collapseProps: p.customProps?.collapseProps || tablePropsModel.properties.expansion.properties.collapseProps
		}
	};

	return tableProps;
}

export { tablePropsModel, getTableProps, type TableProps };

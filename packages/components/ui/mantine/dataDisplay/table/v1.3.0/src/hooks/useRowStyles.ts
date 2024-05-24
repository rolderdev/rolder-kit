/*
Задает классы стилей для строк.
Включение/выключение просиходит здесь. Переменные обрабатываются в таблице в rowClassName
*/

import { createStyles } from '@mantine/core';
import type { TableProps } from '../../types';
import convertColor from '@packages/convert-color';

export default createStyles(
	(
		_,
		{
			enabled,
			rowBorders,
			striped,
			oddBgColor,
			evenBgColor,
			rowBgColor,
			highlightOnHover,
			onHoverBgColor
		}: /*singleSelectedRowBgColor,
			mutliSelectedRowBgColor */
		TableProps['rowStyles']
	) => ({
		row: enabled
			? {
					'&&': {
						backgroundColor: striped ? undefined : convertColor(rowBgColor),
						'&& td': { borderTop: rowBorders ? undefined : 'unset' },
						'&&': { '&&:hover': { backgroundColor: highlightOnHover ? convertColor(onHoverBgColor) : undefined } }
					}
			  }
			: {},
		striped:
			enabled && striped
				? {
						'&&': {
							'&&:nth-of-type(odd)': { backgroundColor: convertColor(oddBgColor) },
							'&:nth-of-type(even)': { backgroundColor: convertColor(evenBgColor) }
						}
				  }
				: {}
		/*multiSelected: { '&&': { '&&': { '&&': { backgroundColor: convertColor(mutliSelectedRowBgColor) } } } },
    singleSelected: { '&&': { '&&': { '&&': { backgroundColor: convertColor(singleSelectedRowBgColor) } } } },
    expandIcon: { transition: 'transform 0.2s ease' },
    expandIconRotated: { transform: 'rotate(90deg)' }, */
	})
);

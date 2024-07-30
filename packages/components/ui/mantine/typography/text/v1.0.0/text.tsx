import { Text } from '@mantine/core';
import { forwardRef, useEffect, useState } from 'react';
import type { Props } from './types';
import { getCompProps } from '@packages/get-comp-props';
import { useTableCellScope } from '@packages/scope';

export default forwardRef(function (props: Props) {
	const { numbro } = R.libs;
	const { getValue, getMasked, getFormatedDate } = R.utils;

	const item = useTableCellScope();
	const p = { ...getCompProps(props, item) } as Props;

	const [value, setValue] = useState('');
	const itemSource = p.useScope && item ? item : p.itemSource;
	const valueSource = p.dataSource === 'item' ? getValue.v8(itemSource, p.sourceField) : p.valueSource;

	useEffect(() => {
		if (valueSource)
			switch (p.textFormat) {
				case 'none':
					setValue(valueSource);
					break;
				case 'number':
					setValue(numbro(valueSource || 0).format(p.numberFormat));
					break;
				case 'date':
					setValue(getFormatedDate.v2({ valueSource }, 'valueSource', p.dateFormatAtText) || '');
					break;
				case 'mask':
					setValue(getMasked.v2({ type: 'pattern', maskPattern: p.textMask }, valueSource) || '');
					break;
			}
	}, [valueSource]);

	return (
		<Text sx={{ width: p.fitContent ? 'fit-content' : undefined }} {...p} {...p.customProps}>
			{value}
		</Text>
	);
});

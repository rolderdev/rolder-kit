import { Text } from '@mantine/core';
import { forwardRef } from 'react';
import type { Props } from '../node/definition';

export default forwardRef(function (p: Props) {
	//const { useSnapshot, proxy } = R.libs.valtio;

	//const item = useSnapshot(proxy(p.item || {}));
	const value = p.sourceType === 'value' ? p.value : R.libs.just.get(p.item || {}, p.field);
	//console.log('Text render', value);
	return (
		<Text {...p} {...p.customProps}>
			{value}
		</Text>
	);
});

/* const { numbro } = R.libs
    const { getValue, getMasked, getFormatedDate } = R.utils

    const item = useTableCellScope()
    const p = { ...getCompProps(props, item) } as Props

    const [value, setValue] = useState('')
    const itemSource = p.useScope && item ? item : p.itemSource

    // Vezdexod
    const valueSource = p.dataSource === 'item'
        ? typeof getValue.v8(itemSource, p.sourceField) === 'number'
            ? String(getValue.v8(itemSource, p.sourceField))
            : getValue.v8(itemSource, p.sourceField)
        : typeof p.valueSource === 'number'
            ? String(p.valueSource)
            : p.valueSource



    useEffect(() => {
        if (valueSource) switch (p.textFormat) {
            case 'none': setValue(valueSource); break
            case 'number': setValue(numbro(valueSource || 0).format(p.numberFormat)); break
            case 'date': setValue(getFormatedDate.v2({ valueSource }, 'valueSource', p.dateFormatAtText) || ''); break
            case 'mask': setValue(getMasked.v2({ type: 'pattern', maskPattern: p.textMask }, valueSource) || ''); break
        }
    }, [valueSource])

    return <Text
        sx={{ 
            width: p.fitContent ? 'fit-content' : undefined,
            // wordWrap: 'break-word' // или 
            whiteSpace: 'pre-wrap'
        }}
        {...p}
        {...p.customProps}
    >{value}</Text> */

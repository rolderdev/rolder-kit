import { Text } from "@mantine/core"
import { useShallowEffect } from "@mantine/hooks"
import { forwardRef, useState } from "react"

export default forwardRef(function (props: any) {
    const { numbro } = window.R.libs
    const { getValue, getMasked, getFormatedDate } = window.R.utils
    const [value, setValue] = useState('')

    useShallowEffect(() => {
        const source = props.dataSource === 'item' ? getValue.v7(props.itemSource, props.sourceField) : props.valueSource
        if (source) switch (props.textFormat) {
            case 'none': setValue(source); break
            case 'number': setValue(numbro(source || 0).format(props.numberFormat)); break
            case 'date': setValue(getFormatedDate.v2({ source }, 'source', props.dateFormatAtText) || ''); break
            case 'mask': setValue(getMasked.v2({ type: 'pattern', maskPattern: props.textMask }, source) || ''); break
        }
    }, [props])

    return <Text
        sx={{ width: props.fitContent && 'fit-content' }}
        {...props}
        {...props.customProps}
    >{value}</Text>
})
import { Text } from "@mantine/core"
import { useShallowEffect } from "@mantine/hooks"
import { numbro } from "@rk/libs"
import { getFormatedDate2, getMasked2, getValue8 } from "@rk/utils"
import { forwardRef, useState } from "react"

export default forwardRef(function (props: any) {
    const [value, setValue] = useState('')

    useShallowEffect(() => {
        const source = props.dataSource === 'item' ? getValue8(props.itemSource, props.sourceField) : props.valueSource
        if (source) switch (props.textFormat) {
            case 'none': setValue(source); break
            case 'number': setValue(numbro(source || 0).format(props.numberFormat)); break
            case 'date': setValue(getFormatedDate2({ source }, 'source', props.dateFormatAtText) || ''); break
            case 'mask': setValue(getMasked2({ type: 'pattern', maskPattern: props.textMask }, source) || ''); break
        }
    }, [props])

    return <Text
        sx={{ width: props.fitContent && 'fit-content' }}
        {...props}
        {...props.customProps}
    >{value}</Text>
})
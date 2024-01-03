import { Title } from "@mantine/core"
import { useShallowEffect } from "@mantine/hooks"
import { dayjs, numbro } from "@rk/libs"
import { getMasked2, getValue8 } from "@rk/utils"
import { forwardRef, useState } from "react"

export default forwardRef(function (props: any) {
    const [value, setValue] = useState('')

    useShallowEffect(() => {
        const source = props.dataSource === 'item' ? getValue8(props.itemSource, props.sourceField) : props.valueSource
        if (source) switch (props.textFormat) {
            case 'none': setValue(source); break
            case 'number': setValue(numbro(source || 0).format(props.numberFormat)); break
            case 'date': setValue(dayjs(source).format(props.dateFormatAtText)); break
            case 'mask': setValue(getMasked2(source, props.textMask) || ''); break
        }
    }, [props])

    return <Title
        order={props.titleOrder}
        sx={{ width: props.fitContent && 'fit-content' }}
        {...props}
        {...props.customProps}
    >{value}</Title>
})
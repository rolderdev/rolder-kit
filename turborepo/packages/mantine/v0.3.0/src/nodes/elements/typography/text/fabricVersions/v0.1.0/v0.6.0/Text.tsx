import { Text } from "@mantine/core"
import { useShallowEffect } from "@mantine/hooks"
import { forwardRef, useState } from "react"
import useScope from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope"
import { CompProps } from "./types"
import { getCompProps } from '@rk/node-fabrik'
import { getFormatedDate2, getMasked2, getValue8 } from "@rk/utils"
import { numbro } from "@rk/libs"

export default forwardRef(function (props: CompProps) {
    const [value, setValue] = useState('')
    const scope = useScope(props.scope, 'v0.1.0')
    const itemSource = props.useScope && scope ? scope.item.get() : props.itemSource
    const valueSource = props.dataSource === 'item' ? getValue8(itemSource, props.sourceField) : props.valueSource

    const p = { ...getCompProps(props, itemSource) } as CompProps

    useShallowEffect(() => {
        if (valueSource) switch (p.textFormat) {
            case 'none': setValue(valueSource); break
            case 'number': setValue(numbro(valueSource || 0).format(p.numberFormat)); break
            case 'date': setValue(getFormatedDate2({ valueSource }, 'source', p.dateFormatAtText) || ''); break
            case 'mask': setValue(getMasked2({ type: 'pattern', maskPattern: p.textMask }, valueSource) || ''); break
        }
    }, [valueSource])

    return <Text
        sx={{ width: p.fitContent ? 'fit-content' : undefined }}
        {...p}
        {...p.customProps}
    >{value}</Text>
})
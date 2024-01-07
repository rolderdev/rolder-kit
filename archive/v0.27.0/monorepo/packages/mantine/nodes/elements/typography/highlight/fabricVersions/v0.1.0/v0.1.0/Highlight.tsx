import { Highlight } from "@mantine/core"
import { useShallowEffect } from "@mantine/hooks"
import { forwardRef, useState } from "react"
import useScope from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope"
import { CompProps } from "./types"
import getCompProps from "../../../../../../../../../libs/nodesFabric/v0.1.0/getCompProps/v0.1.0/getCompProps"

export default forwardRef(function (props: CompProps) {
    const { numbro } = window.R.libs
    const { getValue, getMasked, getFormatedDate } = window.R.utils

    const [value, setValue] = useState('')
    const scope = useScope(props.scope, 'v0.1.0')
    const itemSource = props.useScope && scope ? scope.item.get() : props.itemSource
    const valueSource = props.dataSource === 'item' ? getValue.v8(itemSource, props.sourceField) : props.valueSource

    const p = { ...getCompProps(props, itemSource) } as CompProps

    useShallowEffect(() => {
        if (valueSource) switch (p.textFormat) {
            case 'none': setValue(valueSource); break
            case 'number': setValue(numbro(valueSource || 0).format(p.numberFormat)); break
            case 'date': setValue(getFormatedDate.v2({ valueSource }, 'source', p.dateFormatAtText) || ''); break
            case 'mask': setValue(getMasked.v2({ type: 'pattern', maskPattern: p.textMask }, valueSource) || ''); break
        }
    }, [valueSource])

    return <Highlight        
        sx={{ width: p.fitContent ? 'fit-content' : undefined }}
        {...p}
        {...p.customProps}
    >{value}</Highlight>
})
import { Title } from "@mantine/core"
import { forwardRef, useEffect, useState } from "react"
import { Props } from "./types"
import React from "react"
import { getCompProps } from "@shared/get-comp-props"
import { useTableCellScope } from "@shared/scope"

export default forwardRef(function (props: Props) {
    const { numbro } = R.libs
    const { getValue, getMasked, getFormatedDate } = R.utils

    const item = useTableCellScope()
    const p = { ...getCompProps(props, item) } as Props

    const [value, setValue] = useState('')
    const itemSource = props.useScope && item ? item : props.itemSource
    const valueSource = props.dataSource === 'item' ? getValue.v8(itemSource, props.sourceField) : props.valueSource

    useEffect(() => {
        if (valueSource) switch (p.textFormat) {
            case 'none': setValue(valueSource); break
            case 'number': setValue(numbro(valueSource || 0).format(p.numberFormat)); break
            case 'date': setValue(getFormatedDate.v2({ valueSource }, 'valueSource', p.dateFormatAtText) || ''); break
            case 'mask': setValue(getMasked.v2({ type: 'pattern', maskPattern: p.textMask }, valueSource) || ''); break
        }
    }, [props])

    return <Title
        sx={{ width: p.fitContent ? 'fit-content' : undefined }}
        order={p.titleOrder}
        {...p}
        {...p.customProps}
    >{value}</Title>
})

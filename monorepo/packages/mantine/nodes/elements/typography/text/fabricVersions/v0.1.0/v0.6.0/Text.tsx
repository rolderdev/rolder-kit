import { Text } from "@mantine/core"
import { useShallowEffect } from "@mantine/hooks"
import { useMolecule } from "bunshi/react"
import { forwardRef, useState } from "react"
import { CellMolecule } from "../../../../../../../libs/scopes/table/v0.1.0/cellScope"

export default forwardRef(function (props: any) {
    const { numbro } = window.R.libs
    const { getValue, getMasked, getFormatedDate } = window.R.utils

    const [value, setValue] = useState('')
    const { cellItem } = useMolecule(CellMolecule)

    useShallowEffect(() => {
        let source = ''
        switch (props.dataSource2) {
            case 'item': source = getValue.v7(props.itemSource2, props.sourceField2); break
            case 'table': source = getValue.v7(cellItem.get(), props.sourceField2); break
            case 'value': source = props.valueSource2; break
        }

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
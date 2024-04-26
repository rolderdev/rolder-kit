import { forwardRef } from "react"
import type { Props } from "./types"
import { getCompProps } from "@packages/get-comp-props"
import { DataTable } from "./src/lib"
import type { Item } from "types"
import React from "react"

export default forwardRef(function (props: Props, ref) {
    const { customProps } = props
    const p = { ...getCompProps(props) } as Props

    return <DataTable<Item>
        columns={props.table2Columns || []}
        records={props.table2Items || []}
    //{...customProps}
    />
})

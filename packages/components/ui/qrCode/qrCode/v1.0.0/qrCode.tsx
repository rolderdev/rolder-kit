import { forwardRef } from "react"
import type { Props } from "./types"
import React from "react"
import { getCompProps } from "@packages/get-comp-props"
import { useTableCellScope } from "@packages/scope"
import { QRCodeSVG } from "qrcode.react"

export default forwardRef(function (props: Props) {
    const item = useTableCellScope()

    const p = { ...getCompProps(props, item) } as Props

    return <QRCodeSVG {...p} />
})
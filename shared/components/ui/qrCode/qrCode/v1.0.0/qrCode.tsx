import { forwardRef } from "react"
import { Props } from "./types"
import React from "react"
import { getCompProps } from "@shared/get-comp-props"
import { useTableCellScope } from "@shared/scope"
import { QRCodeSVG } from "qrcode.react"

export default forwardRef(function (props: Props) {
    const item = useTableCellScope()

    const p = { ...getCompProps(props, item) } as Props

    return <QRCodeSVG {...p} />
})
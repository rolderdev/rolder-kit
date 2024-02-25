import { Page } from "@react-pdf/renderer"
import { forwardRef } from "react"
import { Props } from "./types";
import { getCompProps } from "@shared/get-comp-props"
import React from "react";

const childrenNames = ['PdfView', 'PdfText', 'PdfImage']

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    const ch = p.children as any

    const children = Array.isArray(ch)
        ? ch.filter(i => childrenNames.includes(i.props.noodlNode?.model.type.split('.')[1]))
        : childrenNames.includes(ch?.props.noodlNode?.model.type.split('.')[1]) ? ch : undefined

    return <Page
        style={p.style}
        orientation={p.orientation}
        wrap={p.wrap}
        {...p.customProps}>{children}
    </Page>
})
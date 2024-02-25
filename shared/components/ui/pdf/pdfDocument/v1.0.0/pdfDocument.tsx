import { createElement, forwardRef, useImperativeHandle } from "react"
import { Document, Font, pdf } from "@react-pdf/renderer";
import { Props } from "./types";
import React from "react";
import { sendOutput, sendSignal } from "@shared/port-send";

const PdfDocument = (props: Props) => {
    const ch = props.children as any
    const children = Array.isArray(ch)
        ? ch.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'PdfPage')
        : ch?.props.noodlNode.model.type.split('.')[1] === 'PdfPage' ? ch : undefined

    return <Document {...props.customProps} style={props.style}>{children}</Document>
}

export default forwardRef(function (props: Props, ref) {
    const { noodlNode } = props

    Font.register({
        family: "Roboto",
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
    })

    useImperativeHandle(ref, () => ({
        async create() {
            sendOutput(noodlNode, 'creating', true)
            const PDF = pdf(createElement(PdfDocument, props))
            let blob = await PDF.toBlob()
            PDF.updateContainer(createElement(PdfDocument, props))
            blob = await PDF.toBlob()
            sendOutput(noodlNode, 'blob', blob)
            setTimeout(() => {
                sendOutput(noodlNode, 'creating', false)
                sendSignal(noodlNode, 'created')
            })
        },
    }), [props])

    return null
})
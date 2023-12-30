import { createElement, forwardRef, useImperativeHandle } from "react"
import { CompProps } from "./types";
import { Document, Font, pdf } from "@react-pdf/renderer";
import { deepMap } from "nanostores";
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";

export const hack = deepMap<{ [noodlNodeId: string]: boolean }>({})

const PdfDocument = (props: CompProps) => {
    const ch = props.children as any
    const children = Array.isArray(ch)
        ? ch.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'PdfPage')
        : ch?.props.noodlNode.model.type.split('.')[1] === 'PdfPage' ? ch : undefined

    return <Document {...props.customProps}>{children}</Document>
}

export default forwardRef(function (props: CompProps, ref) {
    const { noodlNode } = props

    Font.register({
        family: "Roboto",
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
    })

    useImperativeHandle(ref, () => ({
        async create() {
            if (!hack.get()[noodlNode.id]) hack.setKey(noodlNode.id, true)
            else {
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
                hack.setKey(noodlNode.id, false)
            }
        },
    }), [props, hack])

    return null
})
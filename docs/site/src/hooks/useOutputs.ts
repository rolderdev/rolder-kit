import { useState } from "react"

export default function (forcUpdate: any) {
    const [outputValues, setOutputValues] = useState<{ [portName: string]: any }>({})

    const noodlNode = {
        outputPropValues: {},
        hasOutput() { return true },
        flagOutputDirty() {
            setOutputValues(noodlNode.outputPropValues)
            forcUpdate()
        },
        flagAllOutputsDirty() {
            setOutputValues(noodlNode.outputPropValues)
            forcUpdate()
        },
        sendSignalOnOutput() { }
    }

    return { noodlNode, outputValues }
}
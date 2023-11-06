import { useState } from "react";
import checkInputs from "../../checkInputs/v0.2.0/checkInputs";

export default function (thisProps: { compProps: any, compVersions: CompVersions }) {
    const { compProps, compVersions } = thisProps

    const [Comp, setComp] = useState(compVersions[compProps.version]?.Comp)
    const [resultProps, setResultProps] = useState({})
    const [compReady, setCompReady] = useState(false)

    function checksHandler(resultProps: any, hasFormContext?: boolean) {
        if (resultProps.version) {
            // clear before checks to clear resolved warnings, but to repeat not resolved
            resultProps.noodlNode.clearWarnings()
            const warningsCount = checkInputs({
                noodlNode: resultProps.noodlNode, inputs: compVersions[resultProps.version].inputs, resultProps, hasFormContext
            })
            if (warningsCount === 0) {
                setComp(compVersions[resultProps.version].Comp)
                setResultProps(resultProps)
                setCompReady(true)
            } else setCompReady(false)
        }
    }

    return { compReady, Comp, resultProps, checksHandler }
}
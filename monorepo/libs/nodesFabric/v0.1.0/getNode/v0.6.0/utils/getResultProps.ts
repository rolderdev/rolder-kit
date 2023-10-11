import { customProps } from "../../../portsFabric/v0.5.0/get"
import checkRequired from "./checkRequired"
import convertAndCheckType from "./convertAndCheckType"
import setDefaults from "./setDefaults"
import setValue from "./setValue"

export default function (compVersions: CompVersions, compProps: any) {
    const nodeInputs = compVersions[compProps.version]?.inputs

    if (compProps.version && nodeInputs) {
        // overwrite initial props with changed props from node
        const rawProps = { ...compProps, ...compProps.noodlNode.props }
        const noodlNode: NoodlNode = rawProps.noodlNode

        // set customProps input
        noodlNode.resultProps.customProps = convertAndCheckType(noodlNode, [customProps], 'customProps', rawProps.customProps)
        noodlNode._inputValues.customProps = noodlNode.resultProps.customProps
        setValue(noodlNode, [customProps], 'customProps', noodlNode.resultProps.customProps)

        nodeInputs?.map(i => {
            // convert value and ceck type
            noodlNode.resultProps[i.name] = convertAndCheckType(noodlNode, nodeInputs, i.name, rawProps[i.name])
            // save to internal storage to restore hided inputs
            noodlNode._inputValues[i.name] = noodlNode.resultProps[i.name]
            // set value and restore dependetns if needed
            setValue(noodlNode, nodeInputs, i.name, noodlNode.resultProps[i.name])
        })
        // set defaults if needed for any empty value
        setDefaults(noodlNode, nodeInputs)
        // check required input including dependents
        checkRequired(noodlNode, nodeInputs)

        if (noodlNode.warnings.count) return { compReady: false }
        else return {
            compReady: true,
            resultProps: {
                ...compProps.noodlNode.resultProps,
                noodlNode: compProps.noodlNode,
                children: compProps.children,
                style: compProps.style
            }
        }
    }
    return { compReady: false }
}
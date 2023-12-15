import { NodeInstance } from "@noodl/noodl-sdk"
import icons from "../../../libs/icons/v0.2.0/icons"

export default function checkRequiredInputs(props: { compDef: any, compVersions: CompVersions, version: string }): boolean {
    const { compDef, compVersions, version } = props
    let notReadyCount = 0

    if (compDef.Comp && compVersions[version]?.inputs) {
        const noodlNode: NodeInstance = compDef.props.noodlNode
        Object.keys(compDef.props).forEach(propName => {
            const input = compVersions[version]?.inputs?.find(i => i.name === propName)
            if (input?.required) {
                const value = compDef.props[propName]
                let notReady = false
                if (Array.isArray(value) && !value?.length) notReady = true
                else if (!value) notReady = true
                if (notReady) {
                    notReadyCount++
                    noodlNode.sendWarning(propName, `Specify required input: "${input.displayName}"`)
                }
            }
            if (input?.name === 'iconName' && compDef.props.iconName) {
                if (!icons(compDef.props.iconName)) {
                    notReadyCount++
                    noodlNode.sendWarning('Icon', `There is no "${compDef.props.iconName}" at Rolder kit`)
                }
            }
        })
    } else return false

    if (notReadyCount === 0) return true
    else return false
}
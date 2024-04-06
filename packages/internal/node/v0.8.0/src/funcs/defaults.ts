import isEmpty from "@packages/is-empty"
import { type NodePort } from "@packages/port"
import { type Props } from "../../types"

export function setNodeParameterDefault(nodeInput: NodePort, nodeParameter: Props) {
    if (isEmpty(nodeParameter)) {
        if (!isEmpty(nodeInput.default)) {
            // set port default to mantine theme         
            if (nodeInput.customs?.mantineDefault) {
                const md = nodeInput.customs?.mantineDefault
                let mt = Noodl.getProjectSettings().mantineTheme
                if (mt) mt = eval(mt)[0]
                const dp = mt?.components?.[md.comp]?.defaultProps
                if (dp) {
                    if (typeof dp !== 'function') nodeInput.default = dp[md.prop]
                    else delete nodeInput.default
                } else if (md.prop === 'radius' && mt?.defaultRadius) nodeInput.default = mt.defaultRadius
                else delete nodeInput.default
            }
            // set port default from project defaults
            if (nodeInput.customs?.projectDefaultKey) {
                try {
                    let pdValue = eval(Noodl.getProjectSettings().projectDefaults)?.[0]?.[nodeInput.customs?.projectDefaultKey]
                    if (pdValue) nodeInput.default = pdValue
                } catch (e) {log.error('Project defaults eval error', e)}                
            }
            return nodeInput.default
        } else return undefined
    } return nodeParameter
}

export function setPropDefault(nodeInput: NodePort, prop: any) {
    const d = nodeInput.default

    if (isEmpty(prop) && !isEmpty(d)) return d

    return prop
}
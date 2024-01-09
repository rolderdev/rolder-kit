import { NodePort } from "@rk/port"
import { GraphModelNode, NodeContext, NoodlNode } from "../../../types"
import typeOf from "just-typeof"
import { clearWarning, sendWarning } from "./warnings"
import { hasIcon } from '@rk/icons'

function checkLiteralType(node: GraphModelNode, context: NodeContext, nodeInput: NodePort, value: any) {
    const dn = nodeInput.displayName
    const inputType: any = nodeInput.type
    let typeOfValue: string = typeOf(value)
    if (value && typeOfValue !== inputType) {
        const message = `Input "${dn}" should be "${inputType}", got "${typeOfValue}"`
        if (inputType === 'string') {
            if (!['string', 'number'].includes(typeOfValue)) sendWarning(node, context, dn, message)
        } else sendWarning(node, context, dn, message)
    } else clearWarning(node, context, dn)
}

export default function (node: GraphModelNode, context: NodeContext, nodeInput: NodePort, value: any) {
    const typeOfValue: any = typeOf(value)
    const dn = nodeInput.displayName
    // convert types        
    if (typeOfValue !== 'undefined') {
        let complexValue: any
        let isComplexType = false
        if (nodeInput.type === 'array' && typeOfValue === 'string') {
            isComplexType = true
            // convert single object array to object                                                
            try {
                const evalValue = eval(value)
                if (evalValue?.length && nodeInput.customs?.isObject) {
                    // should have only one object
                    if (evalValue?.length > 1)
                        sendWarning(node, context, dn, `Input "${dn}" should have one object, got ${evalValue?.length}`)
                    // should be an object
                    else if (evalValue?.length === 1 && typeof evalValue[0] !== 'object')
                        sendWarning(node, context, dn, `Input "${dn}" should be an "object", got "${typeOf(evalValue[0])}"`)
                    else clearWarning(node, context, dn)
                    complexValue = evalValue[0]
                }
                // convert array string to array
                else complexValue = evalValue
            } catch (error: any) { sendWarning(node, context, dn, `Input "${dn}" has error "${error.message}"`) }
        } else if (typeOfValue === 'array') {
            isComplexType = true
            // convert array as object
            if (nodeInput.customs?.isObject) {
                // should have only one object
                if (value?.length > 1) sendWarning(node, context, dn, `Input "${dn}" should have one object, got ${value?.length}`)
                // should be an object
                else if (value?.length === 1 && typeof value[0] !== 'object')
                    sendWarning(node, context, dn, `Input "${dn}" should be an "object", got "${typeOf(value[0])}"`)
                else clearWarning(node, context, dn)
                complexValue = value[0]
            } else complexValue = value
        }
        // convert proplist to array
        if (nodeInput.type === 'proplist') {
            isComplexType = true
            complexValue = value.map((i: any) => i.label)
        }
        // convert unit to string        
        if (value.unit) {
            isComplexType = true
            complexValue = value.value + value.unit
        }
        // icon check
        if (nodeInput.name === 'iconName') {
            isComplexType = true
            complexValue = value
            if (!hasIcon(value)) sendWarning(node, context, dn, `There is no "${complexValue}" icon at Rolder kit`)
            else clearWarning(node, context, dn)
        }
        // return for complex type
        if (isComplexType) return complexValue
        // check and return for literal type
        if (!isComplexType) {
            checkLiteralType(node, context, nodeInput, complexValue)
            return value
        }
    }
}
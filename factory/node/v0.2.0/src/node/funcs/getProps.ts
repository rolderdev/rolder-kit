import { NodePort } from "@rk/port"
import { isNil } from "lodash"
import { clearWarning, sendWarning } from "./warnings"
import { GraphModelNode, NodeContext } from "../../../types"
import convertAndCheckType from "./convertAndCheckType"

const baseProps = ['version', 'noodlNode', 'style', 'styles', 'className', 'children', 'customProps', 'propFunction']

export default function (node: GraphModelNode, context: NodeContext, inputs: NodePort[] | undefined, props: any) {
    let resultProps: any = {}
    // take props from inputs (delete orphants)
    inputs?.forEach(i => { if (!isNil(props[i.name])) resultProps[i.name] = props[i.name] })

    // set defaults
    inputs?.forEach(i => {
        if (isNil(resultProps[i.name]) && !isNil(i.default)) {
            // unit format from default to convert later
            if (typeof (i.type) === 'object' && i.type.name === 'number')
                resultProps[i.name] = { value: i.default, unit: i.type.defaultUnit }
            else resultProps[i.name] = i.default
        }
        // restore default unit on editor reset button
        if (!isNil(i.default) && typeof (i.type) === 'object' && i.type.name === 'number' && resultProps[i.name] === i.default)
            resultProps[i.name] = { value: i.default, unit: i.type.defaultUnit }
    })

    Object.keys(resultProps).forEach((propName: string) => {
        // delete disabled dependencies
        const input = inputs?.find(i => i.name === propName)
        if (input && input.customs?.dependsOn && !input.customs.dependsOn(resultProps)) delete resultProps[propName]
        // convert unit
        //if (resultProps[propName]?.unit) resultProps[propName] = `${resultProps[propName].value}${resultProps[propName].unit}`
    })

    // restore base props
    Object.keys(props).filter(propName => baseProps.includes(propName)).forEach((propName: string) => {
        if (!isNil(props[propName])) resultProps[propName] = props[propName]
    })

    // connection required
    inputs?.filter(i => i.customs?.required && ['connection', 'both'].includes(i.customs?.required))
        .forEach(input => {
            const n = input.name
            const dn = input.displayName
            if (isNil(resultProps[n]))
                if (input.customs?.dependsOn) {
                    if (input.customs.dependsOn(resultProps)) sendWarning(node, context, dn, `Empty input from connection: "${dn}"`)
                } else sendWarning(node, context, dn, `Empty input from connection: "${dn}"`)
            else clearWarning(node, context, dn)
        })

    // converts and types check
    Object.keys(resultProps).forEach((propName: string) => {
        const input = inputs?.find(i => i.name === propName)
        if (input) resultProps[propName] = convertAndCheckType(node, context, input, resultProps[propName])
    })

    return resultProps
}
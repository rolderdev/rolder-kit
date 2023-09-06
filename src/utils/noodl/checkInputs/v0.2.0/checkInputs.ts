import { NodeInstance } from "@noodl/noodl-sdk"
import icons from "../../../../libs/icons/v0.2.0/icons"
import isEmpty from "just-is-empty"
import typeOf from "just-typeof"

const types = ['array', 'string']

export default function (thisProps: { noodlNode: NodeInstance, inputs?: NodePort[], resultProps: any, hasFormContext?: boolean }): number {
    const { noodlNode, inputs, resultProps, hasFormContext } = thisProps
    let warningsCount = 0

    function sendWarning(name: string, message: string) {
        warningsCount++
        noodlNode.sendWarning(name, message)
    }

    function checkValueType(input: NodePort) {
        const value = resultProps[input.name]
        const inputType: any = input.type
        const typeOfValue: string = typeOf(value)
        if (value && typeOfValue !== inputType) {
            sendWarning(input.name, `Input "${input.displayName}" should be "${inputType}", got "${typeOfValue}"`)
            return false
        } else return true
    }

    function checkHasValue(input: NodePort) {
        const value = resultProps[input.name]
        if (value !== true && isEmpty(value)) sendWarning(input.name, `Specify required input: "${input.displayName}"`)
    }

    if (inputs) {
        // types check
        inputs.filter((i: any) => types.includes(i.type)).forEach(input => checkValueType(input))
        // requiered inputs
        inputs.filter(i => i.required).forEach(input => {
            const dependsOnInput = inputs.find(i => i.name === input.dependsOn)
            if (dependsOnInput && resultProps[dependsOnInput.name]) checkHasValue(input)
            else if (!dependsOnInput) checkHasValue(input)
        })
        // icon check
        const iconNameInput = inputs.find(i => i.name === 'iconName')
        if (iconNameInput) {
            const iconNameValue = resultProps[iconNameInput.name]
            if (iconNameValue && !icons(iconNameValue)) sendWarning('Icon', `There is no "${iconNameValue}" icon at Rolder kit`)
        }
        // form context check
        const useFormInput = inputs.find(i => i.name === 'useForm')
        if (useFormInput && resultProps[useFormInput.name] && !hasFormContext) sendWarning('useForm', 'Can`t use Form outside of Form context')
    }

    return warningsCount
}
import icons from '../../../../../icons/v0.2.0/icons'
import { changeWarnings } from "./warnings"

export default function (noodlNode: NoodlNode, nodeInputs: NodePort[], inputName: string, value: any) {
    // @ts-ignore
    const { typeOf } = window.R.libs.just
    const nodeInput = nodeInputs.find(i => i.name === inputName)

    function checkLiteralType(nodeInput: NodePort, value: any) {
        const inputType: any = nodeInput.type
        let typeOfValue: string = typeOf(value)
        if (value && typeOfValue !== inputType) {
            const message = `Input "${nodeInput.displayName}" should be "${inputType}", got "${typeOfValue}"`
            if (inputType === 'string') {
                if (!['string', 'number'].includes(typeOfValue)) changeWarnings(noodlNode, 'types', nodeInput.displayName, null, message)
            } else changeWarnings(noodlNode, 'types', nodeInput.displayName, null, message)
            return false
        } else changeWarnings(noodlNode, 'types', nodeInput.displayName, null, undefined)
        return true
    }

    if (nodeInput) {
        const typeOfValue: any = typeOf(value)
        // convert types        
        if (typeOfValue !== 'undefined') {
            let complexValue: any
            let isComplexType = false
            let hasWarnings = false
            if (nodeInput.type === 'array' && typeOfValue === 'string') {
                isComplexType = true
                // convert single object array to object                                                
                try {
                    const evalValue = eval(value)

                    // should have only one object                
                    if (evalValue?.length && nodeInput.isObject) {
                        if (evalValue?.length > 1) {
                            hasWarnings = true
                            changeWarnings(noodlNode, 'types', nodeInput.displayName, null,
                                `Input "${nodeInput.displayName}" should have one object, got ${evalValue?.length}`)
                        } else if (evalValue?.length === 1 && typeof evalValue[0] !== 'object') {
                            hasWarnings = true
                            changeWarnings(noodlNode, 'types', nodeInput.displayName, null,
                                `Input "${nodeInput.displayName}" should be an "object", got "${typeOf(evalValue[0])}"`)
                        } else changeWarnings(noodlNode, 'types', nodeInput.displayName, null, undefined)
                        complexValue = evalValue[0]
                    }
                    // convert array string to array
                    else complexValue = evalValue
                } catch (error: any) {
                    hasWarnings = true
                    changeWarnings(noodlNode, 'types', nodeInput.displayName, null,
                        `Input "${nodeInput.displayName}" has error "${error.message}"`)
                }
            } else if (typeOfValue === 'array') {
                isComplexType = true
                // convert array as object
                if (nodeInput.isObject) {
                    if (value?.length > 1) {
                        hasWarnings = true
                        changeWarnings(noodlNode, 'types', nodeInput.displayName, null,
                            `Input "${nodeInput.displayName}" should have one object, got ${value?.length}`)
                    } else if (value?.length === 1 && typeof value[0] !== 'object') {
                        hasWarnings = true
                        changeWarnings(noodlNode, 'types', nodeInput.displayName, null,
                            `Input "${nodeInput.displayName}" should be an "object", got "${typeOf(value[0])}"`)
                    } else changeWarnings(noodlNode, 'types', nodeInput.displayName, null, undefined)
                    complexValue = value[0]
                } else complexValue = value
            }
            // convert proplist to array
            if (nodeInput.type === 'proplist') {
                isComplexType = true
                complexValue = value.map((i: any) => i.label)
            }
            // convert unit to string
            const unitType: any = nodeInput.type
            if (unitType.units) {
                isComplexType = true
                complexValue = value.value + value.unit
            }
            // icon check            
            if (nodeInput.name === 'iconName') {
                isComplexType = true
                complexValue = value
                if (!icons(complexValue)) {
                    hasWarnings = true
                    changeWarnings(noodlNode, 'types', nodeInput.displayName, null, `There is no "${complexValue}" icon at Rolder kit`)
                }
            }
            // return for complex type
            if (isComplexType && !hasWarnings) return complexValue
            // check and return for literal type
            if (!isComplexType) {
                if (checkLiteralType(nodeInput, complexValue)) return value
            }
        }
    }
}
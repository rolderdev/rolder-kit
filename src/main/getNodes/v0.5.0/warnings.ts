import { isNil } from "lodash"
import { NodeInstance } from "./types"
import map from "just-map-object"

export function sendWarnings(node: NodeInstance) {
    node.clearWarnings()
    if (Object.keys(node.warnings.requiered).length || Object.keys(node.warnings.types).length) {
        node.warnings.count = Object.keys(node.warnings.requiered).length + Object.keys(node.warnings.types).length
        map(node.warnings.requiered, (portDisplayName, message) => node.sendWarning(portDisplayName, message))
        map(node.warnings.types, (portDisplayName, message) => node.sendWarning(portDisplayName, message))
    } else node.warnings.count = 0
}

export function changeWarnings(node: NodeInstance, type: 'requiered' | 'types', displayName: string, value?: any, message?: string) {
    if (type === 'requiered') {
        if (isNil(value)) node.warnings.requiered[displayName] = `Specify required input: "${displayName}"`
        else delete node.warnings.requiered[displayName]
    }
    if (type === 'types') {
        if (message) node.warnings.types[displayName] = message
        else delete node.warnings.types[displayName]
    }
}
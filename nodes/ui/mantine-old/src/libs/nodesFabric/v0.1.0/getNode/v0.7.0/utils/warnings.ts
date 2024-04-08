import isEmpty from "@packages/is-empty"

export function sendWarnings(noodlNode: NoodlNode) {
    // @ts-ignore
    const { map } = window.R.libs.just
    const ownerName = noodlNode.nodeScope.componentOwner.name

    noodlNode.context.editorConnection.clearWarnings(ownerName, noodlNode.id)
    if (Object.keys(noodlNode.warnings.required).length || Object.keys(noodlNode.warnings.types).length) {
        noodlNode.warnings.count = Object.keys(noodlNode.warnings.required).length + Object.keys(noodlNode.warnings.types).length
        // @ts-ignore
        map(noodlNode.warnings.required, (portDisplayName, message) =>
            noodlNode.context.editorConnection.sendWarning(ownerName, noodlNode.id, portDisplayName, { message, showGlobally: true }))
        // @ts-ignore
        map(noodlNode.warnings.types, (portDisplayName, message) =>
            noodlNode.context.editorConnection.sendWarning(ownerName, noodlNode.id, portDisplayName, { message, showGlobally: true }))
    } else if (noodlNode.warnings.context) {
        noodlNode.context.editorConnection.sendWarning(
            ownerName, noodlNode.id, 'Context', { message: noodlNode.warnings.context, showGlobally: true }
        )
    } else noodlNode.warnings.count = 0
}

export function changeWarnings(
    noodlNode: NoodlNode, type: 'required' | 'types' | 'context', displayName?: string, value?: any, message?: string
) {
    switch (type) {
        case 'required': {
            if (displayName)
                if (isEmpty(value)) noodlNode.warnings.required[displayName] = `Specify required input: "${displayName}"`
                else delete noodlNode.warnings.required[displayName]
        } break
        case 'types': {
            if (displayName)
                if (message) noodlNode.warnings.types[displayName] = message
                else delete noodlNode.warnings.types[displayName]
        } break
        default: if (displayName) noodlNode.warnings.context = `This node should be a child of "${displayName}"`
    }
}
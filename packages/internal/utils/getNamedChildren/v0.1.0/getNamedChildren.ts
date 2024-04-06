export default function (children: any, noodlNodeNames: string[]) {
    try {
        return Array.isArray(children)
            ? children.filter(i => noodlNodeNames.includes(i.props.noodlNode?.model.type.split('.')[1]))
            : noodlNodeNames.includes(children?.props.noodlNode?.model.type.split('.')[1]) ? children : undefined
    } catch (error) {
        log.error('Error at getNamedChildren: ', error)
    }
}
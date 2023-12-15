import { forwardRef } from "react"

export default forwardRef(function (props: any) {
    const { children, record } = props

    let repeaterRender = null
    let renderChild = children
    if (Array.isArray(children)) {
        repeaterRender = children[0]
        renderChild = children.slice(1).find(i => i.props.noodlNode.nodeScope.componentOwner._forEachModel?.id === record.id)
    }

    return <>
        {repeaterRender}
        {renderChild}
    </>
})
import { forwardRef } from "react"
import { sendOutput } from "../../../../../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { ScopeProvider, useMolecule } from "bunshi/react"
import { CellMolecule, CellScope } from "../../../../../../../../../../../libs/scopes/table/v0.1.0/cellScope"

export default forwardRef(function (props: any) {
    const { children, record, table2Controlled } = props

    const { cellItem } = useMolecule(CellMolecule, { withScope: [CellScope, record.id] })
    if (!table2Controlled) cellItem.set(record)

    let repeaterRender = null
    let renderChild = children
    if (Array.isArray(children) && table2Controlled) {
        sendOutput(props.noodlNode, 'cellItem', record)
        repeaterRender = children[0]
        renderChild = children.slice(1).find(i => i.props.noodlNode.nodeScope.componentOwner._forEachModel?.id === record.id)
    }

    return table2Controlled ? <>
        {repeaterRender}
        {renderChild}
    </> : <ScopeProvider scope={CellScope} value={record.id}>
        {children}
    </ScopeProvider>
})
import { forwardRef } from "react"
import { ScopeProvider, useMolecule } from "bunshi/react"
import { TableCellMolecule010, TableCellScope010 } from "../../../../../../../../../../../libs/scopes/table/v0.1.0/cellScope"

export default forwardRef(function (props: any) {
    const { children, record, table2Controlled } = props

    const { item } = useMolecule(TableCellMolecule010, { withScope: [TableCellScope010, record.id] })
    if (!table2Controlled) item.set(record)

    let repeaterRender = null
    let renderChild = children
    if (Array.isArray(children) && table2Controlled) {        
        repeaterRender = children[0]
        renderChild = children.slice(1).find(i => i.props.noodlNode.nodeScope.componentOwner._forEachModel?.id === record.id)
    }

    return <ScopeProvider scope={TableCellScope010} value={record.id}>
        {table2Controlled ? <>
            {repeaterRender}
            {renderChild}
        </> : children}
    </ScopeProvider>
})
import { forwardRef } from "react"
import { ScopeProvider, useMolecule } from "bunshi/react"
import { TableCellMolecule, TableCellScope } from "@shared/scope"
import React from "react"
import { Props } from "./types"

export default forwardRef(function (props: Props) {
    const { children, table2Controlled, innerProps } = props
    const record = innerProps?.record

    const itemAtom = useMolecule(TableCellMolecule, { withScope: [TableCellScope, record?.id] })
    if (!table2Controlled && record) itemAtom.set(record)

    let repeaterRender = null
    let renderChild = children
    if (Array.isArray(children) && table2Controlled) {
        repeaterRender = children[0]
        renderChild = children.slice(1).find(i => i.props.noodlNode.nodeScope.componentOwner._forEachModel?.id === record?.id)
    }

    return record
        ? <ScopeProvider scope={TableCellScope} value={record?.id}>
            {table2Controlled ? <>
                {repeaterRender}
                {renderChild}
            </> : children}
        </ScopeProvider>
        : null
})
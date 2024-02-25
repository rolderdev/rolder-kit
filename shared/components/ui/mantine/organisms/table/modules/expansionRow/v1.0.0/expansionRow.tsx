import { forwardRef } from "react"
import { ScopeProvider, useMolecule } from "bunshi/react"
import { TableCellMolecule, TableCellScope } from "@shared/scope"
import React from "react"
import { Props } from "./types"

export default forwardRef(function (props: Props) {
    const { children, innerProps } = props
    const record = innerProps?.record

    const itemAtom = useMolecule(TableCellMolecule, { withScope: [TableCellScope, record?.id] })
    if (record) itemAtom.set(record)

    let repeaterRender = null
    let renderChild = children
    if (Array.isArray(children)) {
        repeaterRender = children[0]
        renderChild = children.slice(1).find(i => i.props.noodlNode.nodeScope.componentOwner._forEachModel?.id === record?.id)
    }

    return record
        ? <ScopeProvider scope={TableCellScope} value={record?.id}>
            {repeaterRender}
            {renderChild}
        </ScopeProvider>
        : null
})
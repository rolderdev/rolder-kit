import { forwardRef } from "react"
import { ScopeProvider, useMolecule } from "bunshi/react"
import { TableCellMolecule, TableCellScope } from "@packages/scope"
import type { Props } from "./types"

export default forwardRef(function (props: Props) {
    const { children, table2Controlled, innerProps } = props
    const record = innerProps?.record

    const itemAtom = useMolecule(TableCellMolecule, { withScope: [TableCellScope, record?.id] })
    if (!table2Controlled && record) itemAtom.set(record)

    return record
        ? <ScopeProvider scope={TableCellScope} value={record?.id}>
            {table2Controlled
                ? Array.isArray(children)
                    ? children.slice(1).find(i => i.props.noodlNode.nodeScope.componentOwner._forEachModel?.id === record?.id)
                    : children
                : children}
        </ScopeProvider>
        : null
})

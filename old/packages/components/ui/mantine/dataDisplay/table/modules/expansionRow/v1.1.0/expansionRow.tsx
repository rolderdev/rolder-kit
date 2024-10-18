import { TableCellMolecule, TableCellScope } from '@packages/scope'
import { ScopeProvider, useMolecule } from 'bunshi/react'
import React, { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const { children, innerProps } = props

	const record = innerProps?.record
	record.parentTableId = innerProps?.tableId // MD

	const itemAtom = useMolecule(TableCellMolecule, { withScope: [TableCellScope, record?.id] })
	if (record) itemAtom.set(record)

	return record ? (
		<ScopeProvider scope={TableCellScope} value={record?.id}>
			{Array.isArray(children)
				? children.slice(1).find((i) => i.props.noodlNode.nodeScope.componentOwner._forEachModel?.id === record?.id)
				: children}
		</ScopeProvider>
	) : null
})

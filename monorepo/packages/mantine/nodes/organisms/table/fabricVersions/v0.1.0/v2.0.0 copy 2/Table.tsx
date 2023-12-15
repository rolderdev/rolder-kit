import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { TableCompProps200 } from './types/TableCompProps';
import TableInstance from './TableInstance';
import getProps from './funcs/getProps';
import { columnsCache } from './funcs/getColumns';
import { originalRecords } from './funcs/getRecords';

export default forwardRef(function (props: TableCompProps200, ref) {
    console.log('wrapper render')

    columnsCache.setKey(props.noodlNode.id, props.table2Columns)
    originalRecords.setKey(props.noodlNode.id, props.table2Items)
    const instanceProps = useMemo(() => getProps(props), [props])

    // Reseters
    const tableRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        table2ResetSingleSelection() { tableRef.current?.setSelectedRecord() },
        table2ResetMultiSelection() { tableRef.current?.setSelectedRecords() },
        table2ResetSort() { tableRef.current?.setSortStatus() }
    }), [])

    return <TableInstance {...instanceProps} ref={tableRef} />
})
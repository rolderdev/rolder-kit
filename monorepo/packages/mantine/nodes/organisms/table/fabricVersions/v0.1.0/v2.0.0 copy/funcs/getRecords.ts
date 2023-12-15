import { records } from "../Table";
import { DataTableSortStatus } from "../lib";
import { TableCompProps200 } from "../types/TableCompProps";

export default (
    { sortStatus, props }: { sortStatus?: DataTableSortStatus, props: TableCompProps200 }
): RItem[] => {
    const { noodlNode, table2Columns, table2Fetching } = props
    const currentRecords = records.get()[noodlNode.id]

    // Front sort    
    if (sortStatus?.direction && !table2Fetching) {
        const sortFunc = table2Columns.find(i => i.accessor === sortStatus?.columnAccessor)?.sort?.func
        if (sortFunc) records.setKey(noodlNode.id, sortFunc(currentRecords, sortStatus.direction))
    }

    return records.get()[noodlNode.id]
}
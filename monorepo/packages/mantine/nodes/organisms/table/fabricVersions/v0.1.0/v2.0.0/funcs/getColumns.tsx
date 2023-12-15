import { TableProps200 } from "../types/TableProps";
import { ColumnDef200 } from "../types/Column";
import { deepMap } from "nanostores";
import { cloneElement } from "react";

export const columnsCache = deepMap<{ [noodleNodeId: string]: any[] }>({})

export default function (
    noodlNode: NoodlNode, columnsDef: ColumnDef200[], sort: TableProps200['sort'], children: any, setFilterValue: any,
) {
    const columnFilters = Array.isArray(children)
        ? children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'ColumnFilter')
        : children?.props.noodlNode.model.type.split('.')[1] === 'ColumnFilter'
            ? [children]
            : null

    const columnCells = Array.isArray(children)
        ? children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'ColumnCell')
        : children?.props.noodlNode.model.type.split('.')[1] === 'ColumnCell'
            ? [children]
            : []
    
    const columns = columnsDef.map((column, columnIdx) => {
        // Sort
        if (!sort.enabled) {
            delete column.sortable
            delete column.sort
        } else {
            if (sort.type === 'backend') delete column.sort?.func
            if (column.sort) column.sortable = true
        }

        // Filters
        // const columnFilter = columnFilters?.find(i => i.props.noodlNode.props.table2ColumnIndex === columnIdx)
        /* if (columnFilter) {
            filterFuncs.setKey(`${noodlNode.id}.${columnIdx}`, column.filterFunc)
            columnFilter.props.noodlNode.resultProps.setFilterValue = setFilterValue
            columnFilter.props.noodlNode.resultProps.column = column
            column.filter = ({ close }: { close: () => void }) => {
                columnFilter.props.noodlNode.resultProps.close = close
                return columnFilter
            }
        } */

        // ColumnCell       


        column.render = (record) => {

            const columnCell = columnCells?.find(i => i.props.noodlNode.props.table2ColumnIndex === columnIdx)

            if (columnCell) {
                //const cellItem = useMolecule(CellItem200, { withScope: [ColumnCellScope, `${columnIdx}_${record.id}`] })
                //cellItem.set(record)
                columnCell.props.noodlNode.resultProps.record = record
                //columnCell.props.noodlNode.resultProps.forceUpdate = forceUpdate()
                return cloneElement(columnCell)
                //console.log(columnCell)
                /* columnCell.props.noodlNode.resultProps.record = record
                columnCell.props.noodlNode.resultProps.recordIdx = recordIdx
                columnCell.props.noodlNode.resultProps.forceUpdate = forceUpdate */
                /*  let render = columnCell
                 if (columnCell.props.noodlNode.childrenCache?.length) {
                     render = columnCell.props.noodlNode.childrenCache
                     forceUpdate()
                 } */
                //sendOutput(columnCell.props.noodlNode, 'tableItem', record)                                
                /* const renderChildren = columnCell?.props.noodlNode.getChildren()                
                console.log(renderChildren[1]?._forEachModel.id)
                let renderItemChild = renderChildren.slice(1).find((i: any) => i._forEachModel.id === record.id)
                return renderChildren?.length <= 1 ? renderChildren?.[0]?.render() : renderItemChild ? renderItemChild.render() : null */
                /* const renderChildren = columnCell?.props.noodlNode.getChildren()
                console.log(renderChildren[0])
                console.log(renderChildren[1])
                if (renderChildren[1]) renderChildren[1]?.update()
                console.log(renderChildren)
                let renderItemChild = renderChildren.slice(1).find((i: any) => i._forEachModel.id === record.id)
                return renderChildren?.length <= 1 ? renderChildren?.[0]?.render() : renderItemChild ? renderItemChild.render() : null */
            } else return window.R.utils.getValue.v8(record, column.accessor)
        }

        return column
    })

    columnsCache.setKey(noodlNode.id, columns)
    return columns
}
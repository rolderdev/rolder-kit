import { MRT_Localization_RU } from "mantine-react-table/locales/ru";
import { Column } from "../types/Column";
import rowProps from "../props/rowProps";
import { TableCompProps } from "../types/TableCompProps";
import { convertColor } from "../../../../../../utils/converters/v0.1.0/converters";
import { MRT_TableOptions } from "mantine-react-table";
import cellProps from "../props/cellProps";
import { Selection } from "../types/Selection";

export default function (props: { resultColumns: Column[], tableProps: TableCompProps, selectionProps: Selection }) {
    const { items, loading, searching, tableDensity, highlightOnHover, withColumnBorders, loaderColor, loaderSize } = props.tableProps
    const { tableProps } = props

    const baseParams: MRT_TableOptions<NItem> = {
        columns: props.resultColumns,
        data: items || [],
        getRowId: (originalRow: NItem) => originalRow.id,
        groupedColumnMode: false,
        enableFacetedValues: true,
        enableColumnOrdering: false,
        enableGlobalFilter: false,
        columnFilterDisplayMode: 'popover',
        enableColumnActions: false,
        enablePagination: false,
        enableSorting: false,
        enableColumnDragging: false,
        localization: MRT_Localization_RU,
        state: {
            isLoading: loading,
            showSkeletons: loading,
            showLoadingOverlay: loading,
            showProgressBars: searching,
            pagination: { pageIndex: 0, pageSize: 3 },
            density: tableDensity,
        },
        mantineTableProps: {
            highlightOnHover,
            withColumnBorders,
            sx: { '& tbody tr:last-of-type td': { borderBottom: 'none' } }
        },
        //mantineTableContainerProps: { sx: { maxHeight: '70%' } },
        mantineLoadingOverlayProps: {
            loaderProps: {
                color: convertColor(loaderColor),
                size: loaderSize
            }
        },
        mantineTableBodyRowProps: ({ row }) => rowProps({ row, ...props }),
        mantineTableBodyCellProps: ({ row, column }: any) => cellProps({ tableProps, columnDef: column.columnDef, row }),
    }

    return baseParams
}
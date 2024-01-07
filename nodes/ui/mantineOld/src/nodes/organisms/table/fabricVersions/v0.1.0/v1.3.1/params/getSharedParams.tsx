import { MRT_Localization_RU } from "mantine-react-table/locales/ru";
import { MRT_TableOptions } from "mantine-react-table";
import { Sx, px } from "@mantine/core";
import { TableCompProps } from "../types/TableCompProps";
import { ColumnDef, FilterDef } from "../types/Column";
import convertColor from "../../../../../../../utils/convertColor/v0.2.0/convertColor";
import { atom } from "nanostores";

export const hoveredRowId = atom('')

export default function (tableProps: TableCompProps, columnsDef: ColumnDef[], height: number) {
    const {
        tableLoading, tableDensity, withColumnBorders, tableLoaderColor, tableLoaderSize,
        stickyHeader, dynamicHeight, tableViewportBOffset, tableMaxHeight, highlightOnHover
    } = tableProps

    const baseParams: Partial<MRT_TableOptions<RItem>> = {
        getRowId: (originalRow: RItem) => originalRow.id,
        groupedColumnMode: false,
        enableFacetedValues: true,
        enableColumnOrdering: false,
        enableGlobalFilter: false,
        columnFilterDisplayMode: 'popover',
        enableColumnActions: false,
        enablePagination: false,
        enableColumnDragging: false,
        enableStickyHeader: stickyHeader,
        localization: MRT_Localization_RU,
        state: {
            showLoadingOverlay: tableLoading,
            showSkeletons: tableLoading,
            pagination: { pageIndex: 0, pageSize: 3 },
            density: tableDensity
        },
        // sorting
        initialState: {
            sorting: columnsDef.some(i => i.enableSorting)
                ? columnsDef.filter(i => i.enableSorting && i.data?.defaultSort)
                    ?.map(i => ({ id: i.header, desc: i.data?.defaultSort === 'desc' })) || []
                : []
        },
        enableSorting: columnsDef.some(i => i.enableSorting),
        mantineTableProps: {
            highlightOnHover,
            withColumnBorders,
            sx: () => {
                let sx: Sx = {
                    borderCollapse: 'separate', borderSpacing: 0,
                    '& thead tr': { boxShadow: 'unset', visibility: tableProps.disableHeader ? 'collapse' : 'visible' },
                    '& thead tr:first-of-type th': { borderLeft: 'none' },
                    '& tbody tr:last-of-type td': { borderBottom: 'none' },
                    '& tbody tr td:first-of-type': { borderLeft: 'none' },
                    '& tbody tr td:last-of-type': { borderLeft: 'none' },
                }
                if (!tableProps.rowsWithBorder) sx['& tbody tr td'] = { borderTop: 'none' }
                return sx
            }
        },
        mantineLoadingOverlayProps: {
            loaderProps: {
                color: convertColor(tableLoaderColor),
                size: tableLoaderSize
            }
        },
        mantineTableContainerProps: {
            sx: {
                minHeight: 80,
                maxHeight: dynamicHeight ? height - px(tableViewportBOffset) : tableMaxHeight,
            }
        },
        defaultColumn: { size: tableProps.defaultColumnSize },
        mantineFilterDateInputProps: ({ column }) => {
            const defaultDateFormat = window.R.params.defaults?.dateFormat
            const columnDef: any = column.columnDef
            const filterDef = columnDef.filter as FilterDef
            return { ...filterDef?.dateInputProps, valueFormat: filterDef?.dateInputProps?.valueFormat || defaultDateFormat }
        }
    }

    return baseParams
}
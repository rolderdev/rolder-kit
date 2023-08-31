import { MRT_Localization_RU } from "mantine-react-table/locales/ru";
import { Column } from "../types/Column";
import { MRT_DensityState } from "mantine-react-table";

export default function getBaseParams(props: {
    resultColumns: Column[], items: Item[], loading: boolean, searching: boolean, tableDensity: MRT_DensityState
}): any {
    const { resultColumns, items, loading, searching, tableDensity } = props
    return {
        columns: resultColumns,
        data: items || [],
        getRowId: (originalRow: Item) => originalRow.id,
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
        }
    };
}
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"
import { TableCompProps } from "./types/TableCompProps";
import { ColumnDef } from "./types/Column";
import { Paper } from "@mantine/core";
import BarLoader from "react-spinners/BarLoader";
import { MRT_TableContainer, useMantineReactTable } from "mantine-react-table";
import convertColor from "../../../../../../utils/convertColor/v0.2.0/convertColor";
import { useShallowEffect, useViewportSize } from "@mantine/hooks";
import getBaseParams from "./variants/basic/params/getBaseParams";
import getBaseColumnsDef from "./variants/basic/params/getBaseColumnsDef";
import { atom, useSetAtom } from "jotai";
import getSharedParams from "./params/getSharedParams";
import getGroupedParams from "./variants/grouped/params/getGroupedParams";
import getGroupedColumnsDef from "./variants/grouped/params/getGroupedColumnsDef";
import { selectItem } from "./selection/singleSelection";
import { resetSelectionAtom } from "./selection/multiSelection";

export const currentViewPortWidthAtom = atom(0)

export default forwardRef(function (props: TableCompProps, ref) {
    const tableRef = useRef<any>(null)

    const resetSelection = useSetAtom(resetSelectionAtom)

    useImperativeHandle(ref, () => ({
        resetSingleSelected() { selectItem(props.noodlNode) },
        resetMultipleSelected() { tableRef.current.resetSelection() },
        expandAll() { tableRef.current.expandAll() },
        unExpandAll() { tableRef.current.unExpandAll() },
    }), [])

    // dynamic maxHeight, current view port width for resize trancated or clamped cell value
    const { height, width } = useViewportSize();
    const setCurrentViewPortWidth = useSetAtom(currentViewPortWidthAtom)
    useShallowEffect(() => {
        setCurrentViewPortWidth(width)
    }, [width])

    // variants
    const columnsDef = useMemo<ColumnDef[]>(() => {
        switch (props.tableVariant) {
            case 'basic': return getBaseColumnsDef(props.columns, props)
            case 'grouped': return getGroupedColumnsDef(props.columns, props)
            default: return []
        }
    }, [props.columns])
    function getVariantParams(tableVariant: 'basic' | 'grouped') {
        switch (tableVariant) {
            case 'basic': return getBaseParams(props)
            case 'grouped': return getGroupedParams(props, getSharedParams(props, columnsDef, height))
        }
    }

    const TableInstance = forwardRef(function (_p, ref) {
        useImperativeHandle(ref, () => ({
            resetSelection() { resetSelection(props.noodlNode, table) },
            expandAll() { if (props.tableVariant === 'grouped') table.toggleAllRowsExpanded(true) },
            unExpandAll() { if (props.tableVariant === 'grouped') table.toggleAllRowsExpanded(false) },
        }), [])
        const table = useMantineReactTable<RItem>({
            columns: columnsDef,
            data: props.items || [],
            ...getSharedParams(props, columnsDef, height),
            ...getVariantParams(props.tableVariant)
        })
        useShallowEffect(() => {
            if (props.tableVariant === 'grouped') table.toggleAllRowsExpanded(true)
            resetSelection(props.noodlNode, table)
        }, [table.getFilteredRowModel()])

        useShallowEffect(() => { if (props.tableVariant === 'grouped') table.toggleAllRowsExpanded(false) }, [])

        return <MRT_TableContainer table={table} />
    })

    return <div style={{ display: props.tableWidth ? 'block' : 'flex', width: props.tableWidth }}>
        <Paper
            shadow={props.tableShadow}
            withBorder={props.tableWithBorder}
            radius={props.tableRadius}
            sx={{ overflow: 'hidden' }}
        >
            <BarLoader
                color={convertColor(props.tableLoaderColor)}
                loading={props.tableSearching}
                cssOverride={{
                    display: "block",
                    position: 'absolute',
                    width: '100%',
                    zIndex: 3,
                    borderRadius: 4
                }}
            />
            <TableInstance ref={tableRef} />
        </Paper>
    </div>
})
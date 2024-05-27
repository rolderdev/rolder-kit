import { forwardRef, useImperativeHandle, useMemo } from "react"
import type { Props } from "./types"
import type { Item } from "types"
import useProps from "./src/hooks/useProps"
import useExpansionRows from "./src/hooks/useExpansionRows"
import { nanoid } from "nanoid"
import { DataTable } from "mantine-datatable"
import { Box } from "@mantine/core"
import { useAutoAnimate } from '@formkit/auto-animate/react'

import '@mantine/core/styles/Table.css';
import 'mantine-datatable/styles.css';
import tableWrapperClasses from './src/styles/tableWrapper.module.css'
import useColumns from "./src/hooks/useColumns"

export default forwardRef(function (props: Props, ref) {
    const columns = useColumns(props.noodlNode, props.items, props.columnsDefinition)

    const p = useProps(props, columns)
    const { noodlNode, customProps, items, onRowClick, onRowClickFunc, dimensions, tableStyles, expansion } = p

    // useMemo, чтобы id присваивался только при монтировании
    const tableId = useMemo(() => nanoid(8), [])

    // Table styles    
    const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>();

    // Row styles
    //const { classes, cx } = useRowStyles(rowStyles)

    // Expansion
    // Этот хук выстрадан и потому прекрасен
    const { expansionRows, updateExpansionRows } = useExpansionRows(noodlNode, items, expansion)

    // Input signals
    useImperativeHandle(ref, () => ({
        /* table2ResetSingleSelection() { setSelectedRecord(tableId, undefined) },
        table2ResetMultiSelection() { setSelectedRecords(tableId, []) },
        table2ResetSort() { setSortStatus(undefined) },
        table2ResetFilters() { resetFilters(); forceUpdate() }, */
        expandAll() { updateExpansionRows(items.map(i => i.id) || []) },
        unexpandAll() { updateExpansionRows([]) }
    }), [tableId, items, expansionRows])

    console.log('render body')

    return <Box className={tableWrapperClasses.container} mah={dimensions.maxHeight}>
        <DataTable<Item>
            //  Table styles    
            //className=""                
            bodyRef={tableStyles.animation ? bodyRef : undefined}
            /* // Row styles
            rowBackgroundColor={() =>
                ({ dark: rowStyles.rowBgColor, light: rowStyles.rowBgColor })
            } */
            // rowClassName={({ id }) => (cx(
            //     { [classes.row]: true }, { [classes.striped]: true },
            //     /*{ [classes.multiSelected]: rowStyles.enabled && selection.multi.enabled && selectedRecords?.map(i => i.id).includes(id) },
            //     { [classes.singleSelected]: rowStyles.enabled && selection.single.enabled && selectedRecord?.id === id } */
            // ))}        
            // Expansion        
            rowExpansion={
                expansion.enabled
                    ? {
                        allowMultiple: expansion.allowMultiple,
                        trigger: onRowClick === 'expansion' ? 'click' : 'never',
                        expanded: {
                            // Фильтруем по статусу, чтобы запустить сворачивание до удаление ноды. Смотри хуку.
                            recordIds: expansionRows.filter(i => !i.deleted).map(i => i.item.id),
                            onRecordIdsChange: updateExpansionRows
                        },
                        content: ({ record, collapse }) => {
                            // Добавляем функцию collapse прямо в объект, чтбы разработчик мог запустить ее и свернуть вручную
                            Noodl.Objects[record.id].collapse = collapse
                            // Здесь, не запускаем функцию reactNode, т.к. content ждет ReactNode, т.е. функцию, а не результат ее выполения
                            return expansionRows.find((i) => i.item.id === record.id)?.reactNode
                        },
                        collapseProps: expansion.collapseProps
                    } : undefined
            }
            onRowClick={onRowClickFunc ? ({ record }) => onRowClickFunc(record) : undefined}
            {...p.libProps}
            {...customProps}
        />
    </Box>
})

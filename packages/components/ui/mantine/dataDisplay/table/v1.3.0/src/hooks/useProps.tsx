import type { Props, TableProps } from "../../types"
import { getCompProps } from "@packages/get-comp-props"

export default function (props: Props): TableProps {
    const { customProps } = props
    const p = { ...getCompProps(props) } as Props

    return {
        customProps,
        noodlNode: p.noodlNode,
        columnsDef: p.table2Columns || [],
        items: p.table2Items || [],
        onRowClick: p.table2OnRowClick,
        libProps: {
            columns: p.table2Columns || [],
            records: p.table2Items || [],
            minHeight: p.minHeight || '84px',
            maxHeight: p.maxHeight || '100%',
            maxWidth: p.fitWidthContent ? 'fit-content' : p.maxWidth || 'fit-content'
        },
        expansion: {
            enabled: true,
            template: p.expansionTemplate,
            allowMultiple: p.allowMultiple,
            collapseProps: { transitionDuration: 50, ...customProps?.collapseProps },
            //expandedItems: []
        }
    }
}

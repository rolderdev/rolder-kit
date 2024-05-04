import { forwardRef, useState } from "react"
import type { Props } from "./types"
import { DataTable } from "./src/lib"
import type { Item } from "types"
import React from "react"
import useProps from "./src/hooks/useProps"
import createExpansionNode from "./src/funcs/createExpansionNode"

export default forwardRef(function (props: Props, ref) {
    const p = useProps(props)
    const { noodlNode, customProps, items, onRowClick, expansion } = p

    // Expansion    
    const [expansionRowNodes, setExpansionRowNodes] = useState<{ id: string; rowRender: any }[]>([]);

    console.log('render body')

    return <DataTable<Item>
        // Expansion
        rowExpansion={
            expansion.enabled
                ? {
                    allowMultiple: expansion.allowMultiple,
                    trigger: onRowClick === 'expansion' ? 'click' : 'never',
                    expanded: {
                        recordIds: expansionRowNodes.map(i => i.id),
                        onRecordIdsChange: (recordIds: string[]) => {
                            createExpansionNode(noodlNode, expansion, items, recordIds, expansionRowNodes)
                                .then(setExpansionRowNodes).catch((e) => { log.error('createExpansionNode error', e) });
                        }
                    },
                    content: ({ record, collapse }) => {
                        window.Noodl.Objects[record.id].collapse = collapse
                        return expansionRowNodes.find((i) => i.id === record.id)?.rowRender
                    },
                    collapseProps: { transitionDuration: 50, ...customProps?.collapseProps },
                } : undefined
        }
        {...p.libProps}
        {...customProps}
    />
})

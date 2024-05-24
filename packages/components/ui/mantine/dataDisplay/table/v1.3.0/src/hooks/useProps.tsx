/*
Хука для управления пропсами. Больно много их в таблице.
Устанавливает все пропсы прямо, даже если это ничего не меняет.
Группирует пропсы для удобства.
Устанавливает дефолты. Можно было бы делать обычным способом - через настройку портов ноды, 
но слишком много сообщений об обязательнвх портах достают разработчика. Поэтому везде явные дефолты.
Порядок параметров отнсоительно синхронизирован с types.d.ts
libProps - стнадартные настройки библиотеки, которые не используются в Table.
*/

import type { Props, TableProps } from "../../types"
import { getCompProps } from "@packages/get-comp-props"

export default function (props: Props): TableProps {
    const { customProps } = props
    const p = { ...getCompProps(props) } as Props

    let resultProps: TableProps = {
        // Base
        noodlNode: p.noodlNode,
        customProps,
        columnsDef: p.columns || [],
        items: p.items || [],
        onRowClick: p.onRowClick || 'disabled',
        libProps: {
            // Base
            columns: p.columns || [],
            records: p.items || [],
            // States
            fetching: p.fetching,
            // Dimensions
            minHeight: p.minHeight || '84px',
            //maxHeight: p.maxHeight || '100%',
            //maxWidth: p.fitWidthContent ? 'fit-content' : p.maxWidth || 'fit-content',
            horizontalSpacing: p.horizontalSpacing || 'sm',
            verticalSpacing: p.verticalSpacing || 'xs',
            //fontSize: p.fontSize || 'sm',
            // Table styles
            shadow: p.shadow || 'sm',
            //withBorder: p.withBorder || false,
            borderRadius: p.borderRadius || 'md',
            withColumnBorders: p.columnBorders,
        },
        tableStyles: {
            // Нужно отлкючать анимацию при сворачивании/разворачивании, иначе конфликтует с Collapse, в который обернуты rowExpansion
            animation: p.expansion ? false : p.animation || true
        },
        rowStyles: {
            enabled: p.rowStyles || false,
            rowBorders: p.rowBorders === false ? false : true,
            striped: p.striped || false,
            rowBgColor: p.rowBgColor || 'white',
            oddBgColor: p.oddBgColor || 'gray.0',
            evenBgColor: p.evenBgColor || 'white',
            highlightOnHover: p.highlightOnHover || false,
            onHoverBgColor: p.onHoverBgColor || 'gray.1'
        },
        expansion: {
            enabled: p.expansion || false,
            template: p.expansionTemplate,
            allowMultiple: p.allowMultiple || false,
            collapseProps: { transitionDuration: 150, ...customProps?.collapseProps },
            expandedItems: p.expandedItems || []
        },
    }

    return resultProps
}

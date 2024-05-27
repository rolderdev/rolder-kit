/*
Хука для управления пропсами. Больно много их в таблице.
Устанавливает все пропсы прямо, даже если это ничего не меняет.
Группирует пропсы для удобства.
Устанавливает дефолты. Можно было бы делать обычным способом - через настройку портов ноды, 
но слишком много сообщений об обязательнвх портах достают разработчика. Поэтому везде явные дефолты.
Порядок параметров отнсоительно синхронизирован с types.d.ts
libProps - стнадартные настройки библиотеки, которые не используются или используются повторно в Table.
*/

import type { ColumnDefinition, Props, TableProps } from "../../types"
import { getCompProps } from "@packages/get-comp-props"

export default function (props: Props, columns: ColumnDefinition[]): TableProps {
    const { customProps } = props
    const p = { ...getCompProps(props) } as Props

    let resultProps: TableProps = {
        // Base
        noodlNode: p.noodlNode,
        customProps,
        items: p.items || [],
        onRowClick: p.onRowClick || 'disabled',
        onRowClickFunc: p.onRowClickFunc,
        libProps: {
            // Base
            columns,
            records: p.items || [],
            // States
            fetching: p.fetching,
            // Layout
            noHeader: p.noHeader,
            // Dimensions
            minHeight: p.minHeight || '84px',
            horizontalSpacing: p.horizontalSpacing || 'sm',
            verticalSpacing: p.verticalSpacing || 'xs',
            fz: p.fz || 'sm',
            // Table styles
            shadow: p.shadow || 'sm',
            withTableBorder: p.withTableBorder || false,
            borderRadius: p.borderRadius || 'md',
            withColumnBorders: p.withColumnBorders,
            // Row styles            
            withRowBorders: p.withRowBorders,
            striped: p.striped,
            rowBackgroundColor: () => ({ light: p.rowBackgroundColor || 'white', dark: p.rowBackgroundColor || 'white' }),
            stripedColor: { light: p.stripedColor || 'gray.0', dark: p.stripedColor || 'gray.0' },
            highlightOnHover: p.highlightOnHover,
            highlightOnHoverColor: p.highlightOnHoverColor,
            // Loader styles
            loaderSize: props.customProps?.loader?.size || 'lg',
            loaderType: props.customProps?.loader?.type || 'dots',
            loaderColor: props.loaderColor || 'blue',
            loaderBackgroundBlur: props.customProps?.loader?.bgBlur || 0.5,
        },
        dimensions: {
            maxHeight: p.maxHeight ? p.maxHeight : '100%'
        },
        tableStyles: {
            // Нужно отлкючать анимацию при сворачивании/разворачивании, иначе конфликтует с Collapse, в который обернуты rowExpansion
            animation: p.expansion ? false : p.animation || true
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

import { forwardRef } from 'react';
import type { Column, Props } from './types';
import { getCompProps } from "@packages/get-comp-props"
import React from 'react';
import Row from './src/row';
import Cell from './src/cell';
import { View } from '@react-pdf/renderer';
import getValue from '@packages/get-value';
import type { Item } from 'types';
import clone from 'just-clone';

function Headers(columns: Column[], items?: Item[]) {
    return columns.map(c => <Cell
        type={c.type || 'text'}
        text={c.title}
        cellStyle={typeof c.headerStyleFunc === 'function'
            ? c.headerStyleFunc(c.headerStyle || {}, items || []) || c.headerStyle
            : c.headerStyle}
        width={c.width}
        align={c.headerAlign}
    />)
}

function Cells(columns: Column[], item: Item) {
    return columns.map(c => <Cell
        type={c.type || 'text'}
        text={c.getValue ? c.getValue(item) : getValue(item, c.accessor)}
        linkTitle={getValue(item, c.linkTitleAccessor || '')}
        cellStyle={typeof c.cellStyleFunc === 'function' ? c.cellStyleFunc(c.cellStyle || {}, item) || c.cellStyle : c.cellStyle}
        width={c.width}
        align={c.cellAlign}
    />)
}

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props
    const columns = p.columns || []
    const tableStyle = { ...p.style, ...p.tableStyle }

    return <View
        wrap={p.wrap}
        style={
            p.getTableStyle
                ? Object.values(p.getTableStyle)?.[0](tableStyle || {}, p.items || []) || tableStyle
                : tableStyle
        }
    >
        {!p.noHeader && <Row
            isFirst={true}
            isFixed={true}
            style={
                p.getHeaderStyle
                    ? Object.values(p.getHeaderStyle)?.[0](p.headerStyle || {}, p.items || []) || p.headerStyle
                    : p.headerStyle
            }
        >
            {p.getColumns
                ? Headers(p.getColumns.getHeaderColumns ? p.getColumns.getHeaderColumns(clone(columns), p.items) || columns : columns, p.items)
                : Headers(columns, p.items)}
        </Row>}
        {p.items?.length && p.items.map(item => <View wrap={p.wrapChildren}>
            <Row style={p.getRowStyle ? Object.values(p.getRowStyle)?.[0](p.rowStyle || {}, item) : {}}>
                {p.getColumns
                    ? Cells(p.getColumns.getRowColumns ? p.getColumns.getRowColumns(clone(columns), item) || columns : columns, item)
                    : Cells(columns, item)}
            </Row>
            {p.children && p.childrenAccessor
                ? React.Children.map(p.children, child =>
                    getValue(item, p.childrenAccessor || '') &&
                    React.cloneElement(child, { items: getValue(item, p.childrenAccessor || ''), isChild: true }))
                : null}
        </View>)}
    </View>
})
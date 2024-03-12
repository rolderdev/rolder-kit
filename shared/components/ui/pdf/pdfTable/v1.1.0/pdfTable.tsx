import { forwardRef } from 'react';
import { Props } from './types';
import { getCompProps } from "@shared/get-comp-props"
import React from 'react';
import Row from './src/row';
import Cell from './src/cell';
import { View } from '@react-pdf/renderer';
import getValue from '@shared/get-value';

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    return <View style={p.style} wrap={p.wrap}>
        {!p.noHeader && <Row isFirst={true} isFixed={true}>
            {p.columns.map(c => <Cell
                type={c.type || 'text'}
                text={c.title}
                cellStyle={c.headerStyle}
                width={c.width}
                align={c.headerAlign}
            />)}
        </Row>}
        {p.items?.length && p.items.map(item => <View wrap={p.wrapChildren}>
            <Row>
                {p.columns.map(c => <Cell
                    type={c.type || 'text'}
                    text={getValue(item, c.accessor)}
                    linkTitle={getValue(item, c.linkTitleAccessor || '')}
                    cellStyle={typeof c.cellStyleFunc === 'function' ? c.cellStyleFunc(item) : c.cellStyle}
                    width={c.width}
                    align={c.cellAlign}
                />)}
            </Row>
            {p.children && p.childrenAccessor
                ? React.Children.map(p.children, child =>
                    getValue(item, p.childrenAccessor || '') &&
                    React.cloneElement(child, { items: getValue(item, p.childrenAccessor || ''), isChild: true }))
                : null}
        </View>)}
    </View>
})
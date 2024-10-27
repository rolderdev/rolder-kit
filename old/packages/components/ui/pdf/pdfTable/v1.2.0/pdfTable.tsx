import { getCompProps } from '@packages/get-comp-props'
import getValue from '@packages/get-value'
import { View } from '@react-pdf/renderer'
import { forwardRef } from 'react'
import React from 'react'
import Cell from './src/cell'
import Row from './src/row'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const p = { ...getCompProps(props) } as Props

	return (
		<View style={p.style} wrap={p.wrap}>
			{!p.noHeader && (
				<Row isFirst={true} isFixed={true}>
					{p.columns.map((c) => (
						<Cell type={c.type || 'text'} text={c.title} cellStyle={c.headerStyle} width={c.width} align={c.headerAlign} />
					))}
				</Row>
			)}
			{p.items?.length &&
				p.items.map((item) => (
					<View wrap={p.wrapChildren}>
						<Row>
							{p.columns.map((c) => (
								<Cell
									type={c.type || 'text'}
									text={c.getValue ? c.getValue(item) : getValue(item, c.accessor)}
									linkTitle={getValue(item, c.linkTitleAccessor || '')}
									cellStyle={typeof c.cellStyleFunc === 'function' ? c.cellStyleFunc(item) : c.cellStyle}
									width={c.width}
									align={c.cellAlign}
								/>
							))}
						</Row>
						{p.children && p.childrenAccessor
							? React.Children.map(
									p.children,
									(child) =>
										getValue(item, p.childrenAccessor || '') &&
										React.cloneElement(child, { items: getValue(item, p.childrenAccessor || ''), isChild: true })
								)
							: null}
					</View>
				))}
		</View>
	)
})

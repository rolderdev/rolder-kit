import { forwardRef } from 'react'
import type { Props } from './types'
import { Grid } from '@mantine/core'

export default forwardRef((props: Props) => {
	function Columns(p: { childIsRepeater?: boolean; children: any; gridColumnsScheme: any }) {
		const { childIsRepeater, children, gridColumnsScheme } = p
		const gridLength = props.gridColumnsScheme.length
		let row = 0
		switch (true) {
			case Array.isArray(children) && childIsRepeater:
				return children.slice(1).map((child: any, idx: number) => {
					if (Number.isInteger(idx / gridLength)) row++
					const gridIdx = idx + gridLength - row * gridLength
					return (
						<Grid.Col key={idx} {...gridColumnsScheme[gridIdx]}>
							{child}
						</Grid.Col>
					)
				})
			case Array.isArray(children) && !childIsRepeater:
				return children.map((child: any, idx: number) => {
					if (Number.isInteger(idx / gridLength)) row++
					const gridIdx = idx + gridLength - row * gridLength
					return (
						<Grid.Col key={idx} {...gridColumnsScheme[gridIdx]}>
							{child}
						</Grid.Col>
					)
				})
			case !Array.isArray(children):
				return <Grid.Col {...gridColumnsScheme[0]}>{children}</Grid.Col>
		}
	}

	return (
		<Grid columns={props.gridColumnsCount} justify={props.gridJustify} align={props.gridAlign} {...props} {...props.customProps}>
			{Columns(props)}
		</Grid>
	)
})

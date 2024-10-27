import type React from 'react'
import { GridBody, type GridBodyProps } from './grid-body'

export type GridProps = GridBodyProps
export const Grid: React.FC<GridProps> = (props) => {
	return (
		<g className="grid">
			<GridBody {...props} />
		</g>
	)
}

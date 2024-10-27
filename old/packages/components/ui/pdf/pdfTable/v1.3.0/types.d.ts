import type { Styles } from '@react-pdf/renderer'
import type { Item } from 'types'

export type Props = {
	children: any
	columns?: Column[]
	getColumns?: {
		getHeaderColumns?(columns: Column[], items?: Item[]): Column[]
		getRowColumns?(columns: Column[], item: Item): Column[]
	}
	items?: Item[]
	wrap: boolean
	wrapChildren: boolean
	noHeader?: boolean
	style?: Styles['string']
	tableStyle?: Styles['string']
	getTableStyle?(style: Styles['string'], items: Item[]): { [x: string]: Styles['string'] }
	childrenAccessor?: string
	isChild?: boolean
	headerStyle?: Styles['string']
	getHeaderStyle?(style: Styles['string'], items: Item[]): { [x: string]: Styles['string'] }
	rowStyle?: Styles['string']
	getRowStyle?(style: Styles['string'], item: Item): { [x: string]: Styles['string'] }
}

export type CellT = {
	type: 'text' | 'image' | 'link'
	text?: string
	linkTitle?: string
	width?: number
	align?: 'left' | 'center' | 'right'
	cellStyle?: {
		cell?: Styles['string']
		text?: Styles['string']
		image?: Styles['string']
	}
	totalElements?: number
	widthArray?: number[]
	isFirst?: boolean
}

export type RowT = {
	children: any
	width?: number
	height?: number
	style?: Styles['string']
	isFirst?: boolean
	isFixed?: boolean
}

export type Column = {
	accessor: string
	type?: 'text' | 'image' | 'link'
	title?: string
	linkTitleAccessor?: string
	width?: number
	headerAlign?: 'left' | 'center' | 'right'
	cellAlign?: 'left' | 'center' | 'right'
	headerStyle?: {
		cell?: Styles['string']
		text?: Styles['string']
	}
	headerStyleFunc?(
		style: { cell?: Styles['string']; text?: Styles['string'] },
		items: Item[]
	): {
		cell?: Styles['string']
		text?: Styles['string']
	}
	cellStyle?: {
		cell?: Styles['string']
		text?: Styles['string']
		image?: Styles['string']
	}
	cellStyleFunc?(
		style: { cell?: Styles['string']; text?: Styles['string']; image?: Styles['string'] },
		item: Item
	): {
		cell?: Styles['string']
		text?: Styles['string']
		image?: Styles['string']
	}
	textStyle?: Styles['string']
	imageStyle?: Styles['string']
	getValue?(item: Item): string
}

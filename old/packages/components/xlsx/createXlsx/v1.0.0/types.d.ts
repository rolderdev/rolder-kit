import type { BaseJsProps } from '@packages/node'
import type { Item } from 'types'

export type Props = BaseJsProps & {
	items?: Item[]
	xlsxColumns: XlsxColumn[]
	fileName?: string
	sheetName?: string
	xlsxCompression?: boolean
}

export type XlsxColumn = {
	accessor: string
	header: string
	size: number
	dataType: string
	dataFormat: any
	defaultValue: any
}

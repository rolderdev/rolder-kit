import type { BaseJsProps } from '@packages/node'

export type Props = BaseJsProps & {
	title?: string
	message: string
	color?: string
	autoClose?: boolean
	autoCloseTimeout?: number
}

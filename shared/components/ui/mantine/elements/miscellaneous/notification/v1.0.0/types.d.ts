import { BaseJsProps } from '@shared/node'

export type Props = BaseJsProps & {
    title?: string
    message: string
    color?: string
    autoClose?: boolean
    autoCloseTimeout?: number
}
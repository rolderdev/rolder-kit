import type { MantineColor } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'
import type { Scope } from '@packages/scope'
import type { Item } from 'types'

export type Props = BaseReactProps & {
	useScope: boolean
	scope?: Scope
	formField: string
	inputError?: boolean | string
	iconName?: string
	iconSize?: string
	iconStroke?: number
	iconColor?: string
	inputItems?: Item[]
	labelField?: string
	backgroundColor?: MantineColor
	defaultItem?: any
}

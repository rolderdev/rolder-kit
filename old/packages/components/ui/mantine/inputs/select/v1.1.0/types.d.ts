import type { MantineColor, SelectItem } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'
import type { Scope } from '@packages/scope'

export type Props = BaseReactProps & {
	controlled: boolean
	useScope?: boolean
	scope?: Scope
	formField: string
	inputError?: boolean | string
	iconName?: string
	iconSize?: string
	iconStroke?: number
	iconColor?: string
	inputItems?: SelectItem[]
	labelField?: string
	backgroundColor?: MantineColor
	selectedItem?: SelectItem
}

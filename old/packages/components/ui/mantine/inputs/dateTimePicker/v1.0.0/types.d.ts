import type { BaseReactProps } from '@packages/node'
import type { Scope } from '@packages/scope'

export type Props = BaseReactProps & {
	useScope: boolean
	scope?: Scope
	formField: string
	inputError?: boolean | string
	iconName?: string
	iconSize?: string
	iconStroke?: number
	iconColor?: string
	focusRightSection?: boolean //??
	defaultDate?: Date
	limitMinDate?: boolean
	minDateOffset?: number
}

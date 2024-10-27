import type { NumberInputProps } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'
import type { Scope } from '@packages/scope'

export type Props = BaseReactProps & {
	useScope: boolean
	scope?: Scope
	formField: string
	inputError?: boolean | string
	defaultNumberValue: number | ''
	numberInputVariant?: NumberInputProps['variant']
	iconName?: string
	iconSize?: string
	iconStroke?: number
	iconColor?: string
	focusRightSection?: boolean
}

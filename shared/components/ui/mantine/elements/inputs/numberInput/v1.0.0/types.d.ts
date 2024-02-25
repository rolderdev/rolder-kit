import { NumberInputProps } from '@mantine/core'
import { BaseReactProps } from '@shared/node'
import { Scope } from '@shared/scope'

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
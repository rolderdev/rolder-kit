import { BaseReactProps } from '@packages/node'
import { Scope } from '@packages/scope'

export type Props = BaseReactProps & {
    useScope: boolean
    scope?: Scope
    inputValue?: string
    formField: string
    inputError?: boolean | string
    debouncedTyping?: boolean
    typingDelay?: number
    validationType?: 'onSubmit' | 'onChange' | 'onBlur'
    debouncedValidation?: boolean
    validationDelay?: number
    iconName?: string
    iconSize?: string
    iconStroke?: number
    iconColor?: string
    focusRightSection?: boolean
}
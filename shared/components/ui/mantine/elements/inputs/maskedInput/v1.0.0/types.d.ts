import { BaseReactProps } from '@shared/node'
import { Scope } from '@shared/scope'

export type Props = BaseReactProps & {
    useScope: boolean
    scope?: Scope
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
    maskType?: 'number' | 'pattern'
    maskPattern?: string
    hideMaskPattern?: boolean
    overwriteMaskPattern?: boolean
    thousandsSeparator?: string
    radix?: string
    numberScale?: number
}
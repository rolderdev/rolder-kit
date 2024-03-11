import { BaseReactProps } from '@shared/node'
import { Scope } from '@shared/scope'

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
}
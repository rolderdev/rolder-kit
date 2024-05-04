import { BaseReactProps } from '@packages/node'
import { Scope } from '@packages/scope'

export type Props = BaseReactProps & {
    useScope: boolean
    scope?: Scope
    formField: string
    inputError?: boolean | string
    validationType?: 'onSubmit' | 'onChange' | 'onBlur'
    debouncedValidation?: boolean
    validationDelay?: number
    focusRightSection?: boolean
}
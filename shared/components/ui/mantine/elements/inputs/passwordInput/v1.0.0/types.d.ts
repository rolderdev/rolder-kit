import { BaseReactProps } from '@shared/node'
import { Scope } from '@shared/scope'

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
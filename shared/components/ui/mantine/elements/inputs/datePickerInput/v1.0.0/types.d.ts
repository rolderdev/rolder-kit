import { BaseReactProps } from '@shared/node'
import { Scope } from '@shared/scope'

export type Props = BaseReactProps & {
    useScope: boolean
    scope?: Scope
    formField: string
    inputError?: boolean | string    
    iconName?: string
    iconSize?: string
    iconStroke?: number
    iconColor?: string
    limitMinDate?: boolean
    minDateOffset?: number
    dateValue?: DatesRangeValue | DateValue | Date[] | undefined
    datePickerType: DatePickerType
}
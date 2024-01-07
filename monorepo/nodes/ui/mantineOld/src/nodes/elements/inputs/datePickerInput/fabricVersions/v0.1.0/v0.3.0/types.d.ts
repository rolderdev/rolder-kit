import { DatePickerType, DatesRangeValue } from "@mantine/dates";
import { Scopes } from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope";
import { BaseProps } from "../../../../../../types";

export type CompProps = BaseProps & {
    iconName?: string
    iconSize?: MantineNumberSize
    iconColor?: string
    stroke?: number
    dateValue?: DatesRangeValue | DateValue | Date[] | undefined
    dateFormatAtDatePicker?: string
    limitMinDate?: boolean
    minDateOffset?: number
    datePickerType: DatePickerType
    inputError?: boolean | string
    formField?: string
}
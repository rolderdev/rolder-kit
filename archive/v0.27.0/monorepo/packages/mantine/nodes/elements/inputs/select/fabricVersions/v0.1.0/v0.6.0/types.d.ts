import { MantineColor } from "@mantine/core";
import { BaseProps } from "../../../../../../types";

export type CompProps = BaseProps & {
    iconName?: string
    iconSize?: MantineNumberSize
    iconColor?: string
    stroke?: number
    inputItems?: RItem[]
    labelField?: string
    inputError?: boolean | string
    formField: string
    backgroundColor?: MantineColor
    defaultItem?: any
}
import { MantineColor } from "@mantine/core";
import { Scopes } from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope";
import { BaseProps } from "../../../../../../types";

export type CompProps = BaseProps & {
    useScope: boolean
    scope: Scopes
    dataSource: 'item' | 'value'
    itemSource: RItem
    sourceField: string
    valueSource: string
    textFormat: 'none' | 'number' | 'date' | 'mask'
    numberFormat: any
    dateFormatAtText: string
    textMask: string
    fitContent: boolean
    highlight: string[]
    highlightColor: MantineColor
    highlightStyles: any
}
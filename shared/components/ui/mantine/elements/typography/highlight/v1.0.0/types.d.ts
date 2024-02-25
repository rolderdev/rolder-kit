import { BadgeVariant, MantineNumberSize } from "@mantine/core";
import { BaseReactProps } from '@shared/node'
import { Scope } from "@shared/scope";

export type Props = BaseReactProps & {
  useScope: boolean
  scope?: Scope
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
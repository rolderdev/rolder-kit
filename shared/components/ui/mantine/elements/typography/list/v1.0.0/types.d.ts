import { BadgeVariant, ListProps, MantineColor, MantineGradient, MantineNumberSize, ThemeIconVariant, TitleOrder } from "@mantine/core";
import { BaseReactProps } from '@shared/node'
import { Scope } from "@shared/scope";

export type Props = BaseReactProps & {
  useScope: boolean
  scope?: Scope
  iconType: 'icon' | 'themeIcon'
  iconName?: string
  iconSize?: MantineNumberSize
  iconColor?: MantineColor
  iconStroke?: number
  themeIconVariant?: ThemeIconVariant
  themeIconSize?: MantineNumberSize
  themeIconRadius?: MantineNumberSize
  themeIconColor?: MantineColor
  themeIconGradient?: MantineGradient
  listScheme: {
    string?: string
    icon?: {
      type: 'icon' | 'themeIcon'
      name?: string
      iconProps?: {
        size?: MantineNumberSize
        color?: MantineColor
        stroke?: number
      }
      themIconProps?: {
        variant?: ThemeIconVariant
        size?: MantineNumberSize
        radius?: MantineNumberSize
        color?: MantineColor
        gradient?: MantineGradient
      }
    }
    customProps?: any
  }[]
  listType: ListProps.type
  withPadding: boolean
}
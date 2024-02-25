import { MantineColor, MantineGradient, MantineNumberSize, ThemeIconVariant } from "@mantine/core";
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
}
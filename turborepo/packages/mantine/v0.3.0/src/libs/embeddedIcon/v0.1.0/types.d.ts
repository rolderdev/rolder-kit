import { ListProps, MantineColor, MantineGradient, MantineNumberSize, ThemeIconVariant } from "@mantine/core";
import { BaseProps } from "../../../nodes/types";

export type EmbeddedIconProps010 = BaseProps & {
    iconType: 'icon' | 'themeIcon'
    iconName?: string
    iconSize?: MantineNumberSize
    iconColor?: MantineColor
    stroke?: number
    themeIconVariant?: ThemeIconVariant
    themeIconSize?: MantineNumberSize
    themeIconRadius?: MantineNumberSize
    themeIconColor?: MantineColor
    themeIconGradient?: MantineGradient
}
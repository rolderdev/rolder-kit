import { ThemeIcon } from "@mantine/core"
import { forwardRef } from "react"
import type { Props } from "./types"
import React from "react"
import { getCompProps } from "@packages/get-comp-props"
import { useTableCellScope } from "@packages/scope"
import convertColor from "@packages/convert-color"

export type { Props as IconProps }

export default forwardRef(function (props: Props) {
    const item = useTableCellScope()

    const p = { ...getCompProps(props, item) } as Props

    const Icon = p.iconName && R.libs.icons[p.iconName]

    return p.iconType === 'themeIcon'
        ? Icon
            ? <ThemeIcon
                variant={p.themeIconVariant}
                size={p.themeIconSize}
                radius={p.themeIconRadius}
                color={p.themeIconColor}
                gradient={p.themeIconGradient}
            >
                <Icon size={p.iconSize} stroke={p.iconStroke} color={convertColor(p.iconColor)} />
            </ThemeIcon>
            : null
        : Icon
            ? <Icon size={p.iconSize} stroke={p.iconStroke} color={convertColor(p.iconColor)} />
            : null
})
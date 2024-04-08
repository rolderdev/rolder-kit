import { List } from "@mantine/core"
import { forwardRef } from "react"
import type { Props } from "./types"
import React from "react"
import { getCompProps } from "@packages/get-comp-props"
import { useTableCellScope } from "@packages/scope"
import Icon, { IconProps } from "@packages/icon"
import getNamedChildren from '@packages/get-named-children'

function ListItems(p: Props) {
    const { listScheme } = p

    return listScheme.map(i => {
        const iconProps: any = i.icon && {
            iconType: i.icon.type, iconName: i.icon.name, iconSize: i.icon.iconProps?.size, iconColor: i.icon.iconProps?.color,
            stroke: i.icon.iconProps?.stroke, themeIconVariant: i.icon.themIconProps?.variant, themeIconSize: i.icon.themIconProps?.size,
            themeIconRadius: i.icon.themIconProps?.radius, themeIconColor: i.icon.themIconProps?.color,
            themeIconGradient: i.icon.themIconProps?.gradient
        } as Partial<IconProps>

        return <List.Item {...i.customProps} icon={i.icon && <Icon {...iconProps} />}>{i.string}</List.Item>
    })
}

export default forwardRef(function (props: Props) {
    const item = useTableCellScope()
    const p = { ...getCompProps(props, item) } as Props

    return <List
        type={p.listType}
        icon={p.iconName && <Icon {...p} />}
        {...p}
        {...p.customProps}
    >
        {//@ts-ignore
            <ListItems {...p} />
        }
        {getNamedChildren(p.children, ['List'])}
    </List >
})

//{}
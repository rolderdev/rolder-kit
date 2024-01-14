import { forwardRef } from "react"
import { CompProps } from "./types"
import getCompProps from "../../../../../../../libs/nodesFabric/v0.1.0/getCompProps/v0.1.0/getCompProps"
import { List } from "@mantine/core"
import getNamedChildren from "../../../../../../../libs/nodesFabric/v0.1.0/getNamedChildren/v0.1.0/getNamedChildren"
import EmbeddedIcon from "../../../../../../../libs/embeddedIcon/v0.1.0/EmbeddedIcon"
import { EmbeddedIconProps010 } from "../../../../../../../libs/embeddedIcon/v0.1.0/types"

function ListItems(p: CompProps) {
    const { listScheme } = p

    return listScheme?.map(i => {
        const iconProps: any = i.icon && {
            iconType: i.icon.type, iconName: i.icon.name, iconSize: i.icon.iconProps?.size, iconColor: i.icon.iconProps?.color,
            stroke: i.icon.iconProps?.stroke, themeIconVariant: i.icon.themIconProps?.variant, themeIconSize: i.icon.themIconProps?.size,
            themeIconRadius: i.icon.themIconProps?.radius, themeIconColor: i.icon.themIconProps?.color,
            themeIconGradient: i.icon.themIconProps?.gradient
        } as EmbeddedIconProps010

        return <List.Item {...i.customProps} icon={i.icon && <EmbeddedIcon {...iconProps} />}>{i.string}</List.Item>
    })
}

export default forwardRef(function (props: CompProps) {
    const p = { ...getCompProps(props) } as CompProps

    return <List
        type={p.listType}
        icon={p.iconName && <EmbeddedIcon {...p} />}
        {...p}
        {...p.customProps}
    >
        <ListItems {...p} />
        {getNamedChildren(p.children, ['List'])}
    </List >
})
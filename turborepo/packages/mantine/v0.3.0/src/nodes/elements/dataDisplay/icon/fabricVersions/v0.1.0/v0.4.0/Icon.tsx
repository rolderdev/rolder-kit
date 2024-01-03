import { forwardRef } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { CompProps } from "./types"
import useScope from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope"
import convertColor from "../../../../../../../utils/convertColor/v0.2.0/convertColor"
import { getCompProps } from '@rk/node-fabrik'

export default forwardRef(function (props: CompProps) {
    const scope = useScope(props.scope, 'v0.1.0')
    const item = props.useScope && scope && scope.item.get()
    const p = { ...getCompProps(props, item) } as CompProps

    const Icon = p.iconName && icons(p.iconName)
    return Icon ? <Icon
        size={p.iconSize}
        color={convertColor(p.iconColor)}
        {...p}
        {...p.customProps}
    /> : undefined
})
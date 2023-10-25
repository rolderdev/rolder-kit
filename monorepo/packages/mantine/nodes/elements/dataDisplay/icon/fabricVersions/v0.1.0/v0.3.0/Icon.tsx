import { forwardRef } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"

export default forwardRef(function (props: any) {
    const Icon = props.iconName && icons(props.iconName)
    return Icon ? <Icon
        size={props.iconSize}
        stroke={props.stroke}
        {...props}
        {...props.customProps}
    /> : <></>
})
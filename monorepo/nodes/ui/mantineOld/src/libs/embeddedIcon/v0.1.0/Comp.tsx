import { ThemeIcon } from "@mantine/core";
import icons from "../../icons/v0.2.0/icons";
import { EmbeddedIconProps010 } from "./types";
import convertColor from "../../../utils/convertColor/v0.2.0/convertColor";

export default function (props: EmbeddedIconProps010) {
    const Icon = props.iconName && icons(props.iconName)

    return props.iconType === 'themeIcon'
        ? Icon ? <ThemeIcon
            variant={props.themeIconVariant}
            size={props.themeIconSize}
            radius={props.themeIconRadius}
            color={props.themeIconColor}
            gradient={props.themeIconGradient}
        >
            <Icon size={props.iconSize} stroke={props.stroke} color={convertColor(props.iconColor)} />
        </ThemeIcon> : null
        : Icon ? <Icon size={props.iconSize} stroke={props.stroke} color={props.iconColor} /> : null
}
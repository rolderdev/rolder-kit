import { ListProps, MantineColor, MantineGradient, MantineNumberSize, ThemeIconVariant } from "@mantine/core";
import { Scopes } from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope";
import { BaseProps } from "../../../../../../types";
import { EmbeddedIconProps010 } from "../../../../../../../libs/embeddedIcon/v0.1.0/types";

export type CompProps = BaseProps & EmbeddedIconProps010 & {
    listScheme?: {
        string?: string        
        icon?: {
            type: 'icon' | 'themeIcon'            
            name?: string
            iconProps?: {
                size?: MantineNumberSize
                color?:MantineColor
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
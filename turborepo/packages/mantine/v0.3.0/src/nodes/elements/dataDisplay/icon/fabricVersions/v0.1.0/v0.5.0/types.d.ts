import { MantineNumberSize } from "@mantine/core";
import { Scopes } from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope";
import { BaseProps } from "../../../../../../types";
import { EmbeddedIconProps010 } from "../../../../../../../libs/embeddedIcon/v0.1.0/types";

export type CompProps = BaseProps & EmbeddedIconProps010 & {    
    useScope: boolean
    scope: Scopes
}
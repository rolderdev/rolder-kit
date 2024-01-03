import { MantineNumberSize } from "@mantine/core";
import { Scopes } from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope";
import { BaseProps } from "../../../../../../types";

export type CompProps = BaseProps & {
    iconName: string
    iconSize: MantineNumberSize
    iconColor: string
    useScope: boolean
    scope: Scopes
}
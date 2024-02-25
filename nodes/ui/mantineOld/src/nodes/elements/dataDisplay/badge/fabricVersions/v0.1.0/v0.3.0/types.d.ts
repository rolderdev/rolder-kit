import { Scopes } from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope";
import { BaseProps } from "../../../../../../types";

export type CompProps = BaseProps & {
    useScope: boolean
    scope: Scopes
    label: string
    badgeVariant: 'light' | 'filled' | 'outline' | 'dot' | 'gradient'
}
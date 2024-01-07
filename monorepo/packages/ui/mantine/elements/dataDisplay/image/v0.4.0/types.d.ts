import { MantineNumberSize } from "@mantine/core";
import { BaseReactProps } from '@rk/node'
//import { Scopes } from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope";
//import { EmbeddedIconProps010 } from "../../../../../../../libs/embeddedIcon/v0.1.0/types";

export type CompProps = BaseReactProps & {
  useScope: boolean
  //  scope?: Scopes    
  placeholderIconSize?: string | number
}
import { ColorScheme, MantineTheme } from "@mantine/core";
import { NotificationsProps } from "@mantine/notifications";
import { BaseReactProps } from '@rk/node'
import { RolderType } from '@rk/types'

export type CompProps = BaseReactProps & {
  notificationsPosition: NotificationsProps['position']
}

declare global {
  interface Window {
    R: RolderType
    Noodl: any    
  }
}
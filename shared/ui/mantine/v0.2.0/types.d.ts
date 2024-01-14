import { ColorScheme, MantineTheme } from "@mantine/core";
import { NotificationsProps } from "@mantine/notifications";
import { BaseReactProps } from '@shared/node'
import { RolderType } from '@shared/types'

export type CompProps = BaseReactProps & {
  notificationsPosition: NotificationsProps['position']
}
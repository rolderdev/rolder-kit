import { ColorScheme, MantineTheme } from '@mantine/core'
import type { NotificationsProps } from '@mantine/notifications'
import type { BaseReactProps } from '@packages/node'
import { RolderType } from '@packages/types'

export type CompProps = BaseReactProps & {
	notificationsPosition: NotificationsProps['position']
}

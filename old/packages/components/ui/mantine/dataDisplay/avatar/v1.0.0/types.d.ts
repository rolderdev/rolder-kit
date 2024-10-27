import type { AvatarProps } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	avatarVariant?: AvatarProps['variant']
}

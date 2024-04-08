import { AvatarProps } from '@mantine/core'
import { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
    avatarVariant?: AvatarProps['variant']
}
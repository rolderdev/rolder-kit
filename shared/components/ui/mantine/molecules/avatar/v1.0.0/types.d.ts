import { AvatarProps } from '@mantine/core'
import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
    avatarVariant?: AvatarProps['variant']
}
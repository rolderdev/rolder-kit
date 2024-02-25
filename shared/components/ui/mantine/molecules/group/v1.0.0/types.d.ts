import { GroupPosition, SpacingValue } from '@mantine/core'
import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
    groupPosition: GroupPosition
    groupSpacing: SpacingValue
}
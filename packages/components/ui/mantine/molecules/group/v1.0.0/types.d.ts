import { GroupPosition, SpacingValue } from '@mantine/core'
import { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
    groupPosition: GroupPosition
    groupSpacing: SpacingValue
}
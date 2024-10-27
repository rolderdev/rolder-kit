import type { GroupPosition, SpacingValue } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	groupPosition: GroupPosition
	groupSpacing: SpacingValue
}

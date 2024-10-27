import { type BadgeVariant, MantineNumberSize } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'
import type { Scope } from '@packages/scope'

export type Props = BaseReactProps & {
	useScope: boolean
	scope?: Scope
	label?: string
	badgeVariant: BadgeVariant
}

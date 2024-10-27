import type { BaseReactProps } from '@shared/node'
import type { Scope } from '@shared/scope'
import type { Item } from '@shared/types'

export type Props = BaseReactProps & {
	useScope: boolean
	scope?: Scope
}

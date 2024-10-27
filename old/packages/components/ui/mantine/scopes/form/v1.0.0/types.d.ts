import { MantineNumberSize } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'
import type { FormValues, Scope } from '@packages/scope'

export type Props = BaseReactProps & {
	useScope: boolean
	scope?: Scope
	formScheme: FormValues
}

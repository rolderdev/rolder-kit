import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	scrollAreaBottomOffset: number
	scrollToMultiplier: number
	scrollBehavior: ScrollBehavior
}

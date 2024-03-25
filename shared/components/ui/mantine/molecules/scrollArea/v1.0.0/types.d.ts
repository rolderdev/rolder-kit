import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
    scrollAreaBottomOffset: number,
    scrollToMultiplier: number
    scrollBehavior: ScrollBehavior
}
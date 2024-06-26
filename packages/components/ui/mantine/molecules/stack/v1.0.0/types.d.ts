import { SpacingValue } from '@mantine/core'
import { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
    stackAlign: 'stretch' | 'center' | 'flex-start' | 'flex-end'
    stackJustify: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around'
    stackSpacing: SpacingValue
}
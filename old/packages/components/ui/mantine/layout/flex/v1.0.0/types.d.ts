import type { FlexProps } from '@mantine/core'
import { BaseReactProps } from '@packages/node'

export type Props = {
	flexAlign?: FlexProps['align']
	flexJustify?: FlexProps['justify']
	flexDirection?: FlexProps['direction']
	flexWrap?: FlexProps['wrap']
	customProps?: any
	children?: any
}

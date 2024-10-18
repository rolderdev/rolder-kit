import type { FooterProps } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	footerWithBorder?: boolean
	footerHeight: FooterProps['height']
}

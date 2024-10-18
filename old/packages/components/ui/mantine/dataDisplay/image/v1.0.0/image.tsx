import { Image } from '@mantine/core'
import { getCompProps } from '@packages/get-comp-props'
import { useTableCellScope } from '@packages/scope'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const item = useTableCellScope()

	const p = { ...getCompProps(props, item) } as Props
	const imageProps = { ...p }
	delete imageProps.placeholderIconSize

	return (
		<Image placeholder={<R.libs.icons.IconPhoto size={p.placeholderIconSize} />} {...imageProps} {...imageProps.customProps} />
	)
})

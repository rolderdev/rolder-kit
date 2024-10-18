import { Image } from '@react-pdf/renderer'
import { forwardRef } from 'react'
import type { Props } from './types'
import { getCompProps } from '@packages/get-comp-props'

export default forwardRef((props: Props) => {
	const p = { ...getCompProps(props) } as Props

	return <Image style={p.style} src={p.src} {...p.customProps} />
})

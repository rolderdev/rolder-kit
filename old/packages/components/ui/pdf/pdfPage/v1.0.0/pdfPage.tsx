import { getCompProps } from '@packages/get-comp-props'
import { Page } from '@react-pdf/renderer'
import { forwardRef } from 'react'
import type { Props } from './types'

const childrenNames = ['PdfView', 'PdfText', 'PdfImage']

export default forwardRef((props: Props) => {
	const p = { ...getCompProps(props) } as Props

	const ch = p.children as any

	const children = Array.isArray(ch)
		? ch.filter((i) => childrenNames.includes(i.props.noodlNode?.model.type.split('.')[1]))
		: childrenNames.includes(ch?.props.noodlNode?.model.type.split('.')[1])
			? ch
			: undefined

	return (
		<Page style={p.style} orientation={p.orientation} wrap={p.wrap} {...p.customProps}>
			{children}
		</Page>
	)
})

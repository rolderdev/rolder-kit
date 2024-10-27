import { getCompProps } from '@packages/get-comp-props'
import { useTableCellScope } from '@packages/scope'
import { QRCodeSVG } from 'qrcode.react'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const item = useTableCellScope()

	const p = { ...getCompProps(props, item) } as Props

	return <QRCodeSVG {...p} />
})

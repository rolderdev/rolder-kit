import convertColor from '@packages/convert-color'
import { forwardRef } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import type { Props } from './types'

export default forwardRef((props: Props) => (
	<BarLoader
		color={convertColor(props.loaderColor)}
		loading={props.loading}
		cssOverride={{
			borderRadius: 4,
			width: props.barLoaderWidth,
			zIndex: props.zIndex,
		}}
		{...props}
		{...props.customProps}
	/>
))

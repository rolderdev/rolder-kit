import { forwardRef } from 'react'
import { Provider } from './src/store'
import type { Props } from './types'

export default forwardRef((props: Props) => (
	<Provider
		initialState={{
			noodlNode: props.noodlNode,
			selectionDbClasses: props.selectionDbClasses || [],
			multiSelectionFilterFunc: props.multiSelectionFilterFunc,
		}}
	>
		{props.children}
	</Provider>
))

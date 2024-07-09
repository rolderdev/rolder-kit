import { forwardRef } from 'react';
import type { Props } from './types';
import { Provider } from './src/store';

export default forwardRef(function (props: Props) {
	return (
		<Provider
			initialState={{
				noodlNode: props.noodlNode,
				selectionDbClasses: props.selectionDbClasses || [],
				isRecordSelectable: props.isRecordSelectable,
			}}
		>
			{props.children}
		</Provider>
	);
});

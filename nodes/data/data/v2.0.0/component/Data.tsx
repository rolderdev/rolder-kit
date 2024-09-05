import { forwardRef, useImperativeHandle, useState } from 'react';
import type { Props } from '../node/definition';
import type { BaseReactProps } from '@shared/node-v1.0.0';

export default forwardRef(function (p: Props & BaseReactProps, ref) {
	const [inited, setInited] = useState(false);

	useImperativeHandle(
		ref,
		() => ({
			setInitState(initState: boolean) {
				if (initState !== inited) setInited(initState);
			},
		}),
		[inited]
	);

	return inited ? p.children : null;
});

import { forwardRef } from 'react';
import type { Props } from '../node/definition';
import type { BaseReactProps } from '@shared/node-v1.0.0';

export default forwardRef(function (p: Props & BaseReactProps, ref) {
	return p.children;
});

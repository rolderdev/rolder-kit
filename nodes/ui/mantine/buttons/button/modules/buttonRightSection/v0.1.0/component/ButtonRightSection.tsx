import { forwardRef } from 'react';
import type { Props } from '../node/definition';

export default forwardRef(function (p: Props) {
	return <>{p.children}</>;
});

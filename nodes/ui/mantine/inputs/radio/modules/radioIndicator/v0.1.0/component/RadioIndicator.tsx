import { forwardRef } from 'react';
import type { Props } from '../node/definition';
import { RadioIndicator } from '@mantine/core';

export default forwardRef(function (p: Props) {
	// Нужно убирать значение с порта, когда в RadioCard, иначе он не может управлять состоянием.
	return <RadioIndicator checked={p.inCard ? undefined : p.checkedProp} {...p} {...p.customProps} />;
});

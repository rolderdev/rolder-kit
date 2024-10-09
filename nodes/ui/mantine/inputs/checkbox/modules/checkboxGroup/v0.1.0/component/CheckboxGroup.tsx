import { forwardRef, useEffect, useState } from 'react';
import type { Props } from '../node/definition';
import { CheckboxGroup } from '@mantine/core';
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';

export default forwardRef(function (p: Props) {
	const [values, setValues] = useState<string[]>(p.defaultValues || []);

	useEffect(() => {
		sendOutput(p.noodlNode, 'selectedValues', values);
		sendOutput(p.noodlNode, 'selectedItem', p.items?.find((i) => values.includes(R.libs.just.get(i, p.valuePath))) || []);
		sendSignal(p.noodlNode, 'changed');
	}, [values]);

	return (
		<CheckboxGroup onChange={setValues} {...p} {...p.customProps}>
			{p.children}
		</CheckboxGroup>
	);
});

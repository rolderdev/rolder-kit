import { forwardRef, useEffect, useState } from 'react';
import type { Props } from '../node/definition';
import { CheckboxCard } from '@mantine/core';
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';

export default forwardRef(function (p: Props) {
	const [checked, setChecked] = useState(p.checkedProp);

	useEffect(() => {
		if (p.checkedProp !== checked) setChecked(p.checkedProp);
	}, [p.checkedProp]);

	useEffect(() => {
		sendOutput(p.noodlNode, 'checked', checked);
		sendSignal(p.noodlNode, 'changed');
	}, [checked]);

	return (
		<CheckboxCard
			checked={p.inGroup ? undefined : checked}
			onClick={p.inGroup ? undefined : () => setChecked((c) => !c)}
			{...p}
			{...p.customProps}
		>
			{p.children}
		</CheckboxCard>
	);
});

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Props } from '../node/definition';
import { NumberInput, type NumberInputHandlers } from '@mantine/core';
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';

export default forwardRef(function (p: Props, ref) {
	//const Icon = props.iconName && R.libs.icons[props.iconName]

	const [value, setValue] = useState<string | number>('');
	const handlers = useRef<NumberInputHandlers>();

	useEffect(() => {
		sendOutput(p.noodlNode, 'value', value);
		sendSignal(p.noodlNode, 'changed');
	}, [value]);

	useEffect(() => {
		if (p.defaultValue) setValue(p.defaultValue);
	}, []);

	useImperativeHandle(
		ref,
		() => ({
			reset() {
				setValue('');
				sendOutput(p.noodlNode, 'value', '');
				sendSignal(p.noodlNode, 'reseted');
			},
			increment() {
				handlers.current?.increment();
			},
			decrement() {
				handlers.current?.decrement();
			},
		}),
		[]
	);

	return (
		<NumberInput
			value={value}
			//icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
			//error={props.inputError || false}
			onChange={setValue}
			handlersRef={handlers}
			{...p}
			{...p.customProps}
		/>
	);
});

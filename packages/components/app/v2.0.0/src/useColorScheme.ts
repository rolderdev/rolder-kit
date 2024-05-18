import type { ColorScheme } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import type { NoodlNode } from '@packages/node';
import { sendOutput, sendSignal } from '@packages/port-send';
import { useEffect, useState } from 'react';
import type { Props } from '../types';

export default function (noodlNode: NoodlNode, colorSchemeProp: Props['colorScheme']) {
	const systemColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useState<ColorScheme>(systemColorScheme);

	useEffect(() => {
		sendOutput(noodlNode, 'colorScheme', colorScheme);
		sendSignal(noodlNode, 'colorSchemeChanged');
	}, [systemColorScheme]);

	useEffect(() => {
		if (colorSchemeProp === 'auto') {
			if (colorScheme !== systemColorScheme) setColorScheme(systemColorScheme);
		} else {
			if (colorScheme !== colorSchemeProp) setColorScheme(colorSchemeProp);
		}
	}, [colorSchemeProp, systemColorScheme]);

	return { colorScheme, setColorScheme };
}

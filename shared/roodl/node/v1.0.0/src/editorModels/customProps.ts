import { getNodePort, getPortDef, type PortDef } from '@shared/port-v1.0.0';

export const getCustomPropsPortDef = () => {
	return {
		...getPortDef({
			name: 'customProps',
			displayName: 'Custom props',
			group: 'Advanced',
			type: 'objectEval',
			visibleAt: 'both',
			codeComment: `/*(props) => {
	// Тут твой крутой код, использующий текущие props.
	return {} // Тут твои крутые кастомные настройки ноды.
}*/`,
		}),
		index: 1000,
	} as PortDef;
};

export const getCustomPropsPort = () => {
	return getNodePort('input', getCustomPropsPortDef());
};

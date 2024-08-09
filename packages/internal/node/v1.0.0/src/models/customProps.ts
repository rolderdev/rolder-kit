import { getPortDef, type PortDef } from '@packages/port';

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
	return {} // Тут твои крутиые кастомные настройки ноды.
}*/`,
		}),
		index: 1000,
	} as PortDef;
};

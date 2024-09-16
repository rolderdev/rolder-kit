import { getPortDef, type PortDef, type ResultPortDef } from './src/models/portDefinition';
export { getPortDef, type PortDef, type ResultPortDef };
export { getNodePort, NodePortSchema, type NodePort } from './src/models/nodePort';

// Enums
export const sizes = [
	{ label: 'xs', value: 'xs' },
	{ label: 'sm', value: 'sm' },
	{ label: 'md', value: 'md' },
	{ label: 'lg', value: 'lg' },
	{ label: 'xl', value: 'xl' },
];

// Groups
export const margins: ResultPortDef[] = [
	getPortDef({
		name: 'margins',
		displayName: 'Margins',
		group: 'Custom',
		customGroup: 'Margins',
		type: 'boolean',
		default: false,
	}),
	getPortDef({
		name: 'm',
		group: 'Custom',
		customGroup: 'Margins',
		type: sizes,
		displayName: 'Margins',
		dependsOn: (p) => p.margins,
	}),
	getPortDef({
		name: 'mx',
		group: 'Custom',
		customGroup: 'Margins',
		type: sizes,
		displayName: 'Margin x-axis',
		dependsOn: (p) => p.margins,
	}),
	getPortDef({
		name: 'my',
		group: 'Custom',
		customGroup: 'Margins',
		type: sizes,
		displayName: 'Margin y-axis',
		dependsOn: (p) => p.margins,
	}),
	getPortDef({
		name: 'mt',
		group: 'Custom',
		customGroup: 'Margins',
		type: sizes,
		displayName: 'Margin top',
		dependsOn: (p) => p.margins,
	}),
	getPortDef({
		name: 'mr',
		group: 'Custom',
		customGroup: 'Margins',
		type: sizes,
		displayName: 'Margin right',
		dependsOn: (p) => p.margins,
	}),
	getPortDef({
		name: 'mb',
		group: 'Custom',
		customGroup: 'Margins',
		type: sizes,
		displayName: 'Margin bottom',
		dependsOn: (p) => p.margins,
	}),
	getPortDef({
		name: 'ml',
		group: 'Custom',
		customGroup: 'Margins',
		type: sizes,
		displayName: 'Margin left',
		dependsOn: (p) => p.margins,
	}),
];

export const paddings: ResultPortDef[] = [
	getPortDef({
		name: 'paddings',
		group: 'Custom',
		customGroup: 'Paddings',
		type: 'boolean',
		displayName: 'Paddings',
		default: false,
	}),
	getPortDef({
		name: 'p',
		group: 'Custom',
		customGroup: 'Paddings',
		type: sizes,
		displayName: 'Padding',
		dependsOn: (p) => p.paddings,
	}),
	getPortDef({
		name: 'px',
		group: 'Custom',
		customGroup: 'Paddings',
		type: sizes,
		displayName: 'Padding x-axis',
		dependsOn: (p) => p.paddings,
	}),
	getPortDef({
		name: 'py',
		group: 'Custom',
		customGroup: 'Paddings',
		type: sizes,
		displayName: 'Padding y-axis',
		dependsOn: (p) => p.paddings,
	}),
	getPortDef({
		name: 'pt',
		group: 'Custom',
		customGroup: 'Paddings',
		type: sizes,
		displayName: 'Padding top',
		dependsOn: (p) => p.paddings,
	}),
	getPortDef({
		name: 'pr',
		group: 'Custom',
		customGroup: 'Paddings',
		type: sizes,
		displayName: 'Padding right',
		dependsOn: (p) => p.paddings,
	}),
	getPortDef({
		name: 'pb',
		group: 'Custom',
		customGroup: 'Paddings',
		type: sizes,
		displayName: 'Padding bottom',
		dependsOn: (p) => p.paddings,
	}),
	getPortDef({
		name: 'pl',
		group: 'Custom',
		customGroup: 'Paddings',
		type: sizes,
		displayName: 'Padding left',
		dependsOn: (p) => p.paddings,
	}),
];

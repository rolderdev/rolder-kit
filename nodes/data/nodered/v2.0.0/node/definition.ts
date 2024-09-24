import type { BaseJsProps } from '@shared/node-v1.0.0';
import type { JsNodeDef } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';
import initState from '@shared/init-state-v0.1.0';

export type Props = BaseJsProps & {
	flowEndpoint?: string;
	flowData?: {
		data: any;
		files: File[];
		params: any;
	};
	timeout: number;
	useServices: boolean;
	selectedService?: string;
	serviceVersion?: string;
};

export default {
	hashTag: '#expreimental',
	module: { dynamic: import('../component/nodered') },
	inputs: [
		getPortDef({
			name: 'flowEndpoint',
			displayName: 'Flow endpoint',
			group: 'Params',
			type: 'string',
			dependsOn: (p: Props) => !p.useServices,
		}),
		getPortDef({
			name: 'timeout',
			displayName: 'Timeout',
			group: 'Params',
			type: 'number',
			default: 10000,
		}),
		getPortDef({
			name: 'useServices',
			displayName: 'Use Services',
			group: 'Custom',
			customGroup: 'Services',
			type: 'boolean',
			default: false,
		}),
		// getPortDef({
		// 	name: 'selectedService',
		// 	displayName: 'Service',
		// 	group: 'Custom',
		// 	customGroup: 'Services',
		// 	type: [
		// 		{ label: 'Upload files', value: 'uploadFiles' },
		// 		{ label: 'Delete files by URL', value: 'deleteFilesByUrl' },
		// 		{ label: 'Copy DB class', value: 'copyDBClass' },
		// 	],
		// 	default: 'uploadFiles',
		// 	dependsOn: (p: Props) => p.useServices,
		// }),
		// getPortDef({
		// 	name: 'serviceVersion',
		// 	displayName: 'Version',
		// 	group: 'Custom',
		// 	customGroup: 'Services',
		// 	type: [
		// 		{ label: 'd2', value: 'd2' },
		// 		{ label: 'p2', value: 'p2' },
		// 	],
		// 	default: 'd2',
		// 	dependsOn: (p: Props) => p.useServices,
		// }),
		// getPortDef({
		// 	name: 'serviceVersion',
		// 	displayName: 'Version',
		// 	group: 'Custom',
		// 	customGroup: 'Services',
		// 	type: [],
		// 	dependsOn: (p: Props) => p.useServices,
		// 	transform: (p: Props, portDef) => {
		// 		portDef.type = await
		// 	},
		// }),

		getPortDef({
			name: 'flowData',
			displayName: 'Flow data',
			group: 'Data',
			type: '*',
		}),
		getPortDef({
			name: 'execute',
			displayName: 'Execute',
			group: 'Signals',
			type: 'signal',
		}),
	],
	outputs: [
		getPortDef({
			name: 'executing',
			displayName: 'Executing',
			group: 'States',
			type: 'boolean',
		}),
		getPortDef({
			name: 'executed',
			displayName: 'Executed',
			group: 'Signals',
			type: 'signal',
		}),
		getPortDef({
			name: 'result',
			displayName: 'Result',
			group: 'Data',
			type: '*',
		}),
	],
	// getInspectInfo: (p: Props, outProps) => [
	// 	{ type: 'text', value: `API ${p.apiVersion}` },
	// 	{ type: 'text', value: `=== Scheme ===` },
	// 	{ type: 'value', value: p.updateScheme },
	// 	outProps.data && { type: 'text', value: `=== Data ===` },
	// 	outProps.data && { type: 'value', value: outProps.data },
	// ],
	transform: async (p: Props, portDefs) => {
		// Получаем от сервиса все всервисы и их версии
		// Находим сервис дефолтный
		// Выбираем серивис
		// Выбираем версию для выьранного сервиса

		await new Promise((resolve) => {
			setTimeout(() => {
				portDefs.inputs.push(
					getPortDef({
						name: 'selectedService',
						displayName: 'Service',
						group: 'Custom',
						customGroup: 'Services',
						type: [{ label: 'Upload files', value: 'uploadFiles' }],
						default: 'uploadFiles',
						dependsOn: (p: Props) => p.useServices,
					})
				);

				resolve(undefined);
			}, 3000);
		});

		// const allServices = await sdrgfsdrfvsdf;

		// portDefs.inputs.push(
		// 	getPortDef({
		// 		name: 'selectedService',
		// 		displayName: 'Service',
		// 		group: 'Custom',
		// 		customGroup: 'Services',
		// 		type: allServices.type,
		// 		default: 'uploadFiles',
		// 		dependsOn: (p: Props) => p.useServices,
		// 	})
		// ),
		// 	portDefs.inputs.push(
		// 		getPortDef({
		// 			name: 'serviceVersion',
		// 			displayName: 'Version',
		// 			group: 'Custom',
		// 			customGroup: 'Services',
		// 			type: allServices.type,
		// 			default: allServices.default,
		// 			dependsOn: (p: Props) => p.useServices,
		// 		})
		// 	);
	},
	initialize: async () => {
		await initState('initialized');
	},
	disableCustomProps: true,
} satisfies JsNodeDef;

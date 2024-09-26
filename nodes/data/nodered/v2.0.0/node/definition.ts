import type { BaseJsProps } from '@shared/node-v1.0.0';
import type { JsNodeDef } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';
import initState from '@shared/init-state-v0.1.0';
import { getServices, type Services } from './getServices';

export type Props = BaseJsProps & {
	flowEndpoint?: string;
	flowData: {
		data?: any;
		files?: File[];
		params?: any;
	};
	timeout: number;
	useServices: boolean;
	services?: Services;
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
		getPortDef({
			name: 'selectedService',
			displayName: 'Service',
			group: 'Custom',
			customGroup: 'Services',
			type: [],
			dependsOn: (p: Props) => p.useServices,
		}),
		getPortDef({
			name: 'serviceVersion',
			displayName: 'Version',
			group: 'Custom',
			customGroup: 'Services',
			type: [],
			dependsOn: (p: Props) => p.useServices,
		}),
		getPortDef({
			name: 'backendServiceVersion',
			displayName: 'Backend service version',
			group: 'Custom',
			customGroup: 'Services',
			type: [
				{ label: 'd2', value: 'd2' },
				{ label: 'p2', value: 'p2' },
			],
			default: 'p2',
			dependsOn: (p: Props) => p.useServices,
		}),
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
	transform: async (p: Props, portDefs) => {
		console.log('nodered transform');
		// Получаем из nodered сервисы, и держим их в props
		// Внутри дожидаемся подключения к Kuzzle
		if (!p?.services) p.services = await getServices();

		// console.log('Инициализация завершена - transform!', R?.params?.creds);
		// console.log('Сервисы - transform!', p.services);

		if (p.services) {
			const servicesType: { label: string; value: string }[] = Object.keys(p.services).map((iServiceName: string) => {
				return {
					label: p.services[iServiceName].nameForLabel,
					value: iServiceName,
				};
			});

			// Находим порт для модификации.
			// Он уже определен в общем списке, нам он нужен там, чтобы transform в serviceVersion поймал выбранный сервис.
			const selectedServicePort = portDefs.inputs.find((input) => input.name === 'selectedService');
			const serviceVersionPort = portDefs.inputs.find((input) => input.name === 'serviceVersion');
			if (selectedServicePort && serviceVersionPort) {
				// Найдем дефолт. Лучше бы это определять в самом Nodered.
				const getDefaultServiceName = (p: Props) => {
					for (const serviceName in p.services) {
						if (p.services[serviceName]?.isDefault === true) return serviceName;
					}
					return;
				};
				const defaultServiceName = getDefaultServiceName(p);

				// Добавим в порт список сервисов для выбора.
				selectedServicePort.type = servicesType;
				// Установим дефолтный. Нужно учитывать, что его не будет в props пока мы не в runtime.
				selectedServicePort.default = defaultServiceName;

				// Добавим в порт список версий для выбора.
				serviceVersionPort.type = p.services[p.selectedService || defaultServiceName].serviceVersion;
				// Установим дефолтную версию.
				serviceVersionPort.default = p.services[p.selectedService || defaultServiceName].defaultServiceVersion;
			}
		} else {
			log.error('Не удалось получить сервисы!');
		}
	},
	validate: async (p: Props) => {
		console.log('nodered validate');
		// Проверяем, получили ли мы creds из Kuzzle.
		return R.params.creds?.find((i) => i.name === 'nodered')?.data
			? true
			: 'В Kuzzle -> config -> creds нет логина и пароля для доступа к nodeRed!'; //There is no creds for Nodered at backend config.',
	},
	initialize: async (p: Props) => {
		console.log('nodered initialize');
		// Ждем, что в R появятся creds для nodered
		await initState('initialized');
		// console.log('Инициализация завершена - initialize!', R?.params?.creds);
	},
	disableCustomProps: true,
} satisfies JsNodeDef;

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
		// Получаем из p.services объект с сервисами
		// Получаем дефолтные настройки
		// Получаем ключи словаря сервисов - их названия
		// Подаем их в выбор сервиса
		// После выбора сервиса, получаем его версии и подаем в выбор версий
		// После выбора сервиса, версии и версии бэкенда d2/p2 (p2 по дефолту) формируем ссылку

		if (p.services) {
			const servicesType = Object.keys(p.services).map((iServiceName: string) => {
				return {
					label: p.services?.[iServiceName]?.nameForLabel,
					value: iServiceName,
				};
			});

			// Находим порт для модификации.
			// Он уже определен в общем списке, нам он нужен там, чтобы transform в serviceVersion поймал выбранный сервис.
			const selectedServicePort = portDefs.inputs.find((input) => input.name === 'selectedService');
			const serviceVersionPort = portDefs.inputs.find((input) => input.name === 'serviceVersion');
			if (selectedServicePort && serviceVersionPort) {
				// Найдем дефолт. Лучше бы это определять в самом Nodered.
				const defaultServiceName = servicesType[0].value;

				// Добавим в порт список сервисов для выбора.
				selectedServicePort.type = servicesType;
				// Установим дефолтный. Нужно учитывать, что его не будет в props пока мы не в tuntime.
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
	validate: async () =>
		// Проверяем, получили ли мы creds из Kuzzle.
		R.params.creds?.filter((i) => i.name === 'nodered')?.[0].data
			? true
			: 'В Kuzzle -> config -> creds нет логина и пароля для доступа к nodeRed!', //There is no creds for Nodered at backend config.',
	initialize: async (p: Props) => {
		// Ждем, что в R появятся creds для nodered
		await initState('initialized');
		// Получаем из nodered сервисы, и передаем из через props
		p.services = await getServices();
	},
	disableCustomProps: true,
} satisfies JsNodeDef;

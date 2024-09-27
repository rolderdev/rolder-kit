import ky from 'ky';
import type { Props } from '../node/definition';
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { NoodlNode } from '@shared/node-v1.0.0';

export default {
	async execute(p: Props, noodlNode: NoodlNode) {
		const { project, backendVersions, environment, dbName } = R.env;
		const { flowEndpoint, flowData, timeout, useServices, selectedService, serviceVersion } = p;

		const backendVersion = backendVersions?.app;
		if (!dbName) {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`);
			log.error('No dbName', R.env);
			return;
		}

		if (flowEndpoint || selectedService) {
			const startTime = log.start();

			log.info(`nodered ${flowEndpoint || selectedService} props`, { flowEndpoint, flowData });
			sendOutput(noodlNode, 'executing', true);

			const noderedCreds = R.params.creds?.filter((i) => i.name === 'nodered')?.[0].data;

			if (noderedCreds) {
				let nodeRedUrl = '';

				// Если флаг useServices, то используем ссылку ссответствующего сервиса
				if (useServices) {
					const backendServiceVersion = p.customProps?.backendServiceVersion || 'p2';

					if (selectedService && serviceVersion) {
						// Собираем ссылку на основе выбранных параметров для сервиса
						nodeRedUrl = `https://${selectedService}.services.${backendServiceVersion}.rolder.app/${selectedService}_${serviceVersion}`;
					} else {
						log.error('Не удалось получить параметры сервисов!');
					}
				} else {
					nodeRedUrl = `https://${project}.nodered.${backendVersion}.rolder.app/${flowEndpoint}`;
				}

				const formData = new FormData();
				if (flowData) {
					if (flowData.params)
						formData.append(
							'params',
							JSON.stringify({
								// Так как запрос будет идти к сервисам, добавляем информацию о среде проекта
								project,
								backendVersion: environment || backendVersion,
								...flowData.params,
							})
						);
					if (flowData.data) formData.append('data', JSON.stringify(flowData.data));
					if (flowData.files) flowData.files.map((i) => formData.append(encodeURIComponent(i.name), i));
				}

				try {
					const jsonResp = await ky
						.post(nodeRedUrl, {
							headers: {
								Authorization: 'Basic ' + btoa(`${noderedCreds.username}:${noderedCreds.password}`),
							},
							body: formData,
							timeout: timeout,
						})
						.json();
					sendOutput(noodlNode, 'result', jsonResp);
					sendOutput(noodlNode, 'executing', false);
					sendSignal(noodlNode, 'executed');
					log.info(`nodered ${flowEndpoint}`, jsonResp);
					log.end(`nodered: ${flowEndpoint}`, startTime);
				} catch (e: any) {
					log.error(`nodered error`, e);
					R.libs.mantine?.MantineError?.('Системная ошибка!', `nodered error: ${e.message}`);
				}
			}
		}

		return;
	},
};

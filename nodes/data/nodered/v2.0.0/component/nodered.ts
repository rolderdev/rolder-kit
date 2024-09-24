import ky from 'ky';
import type { Props } from '../node/definition';
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { NoodlNode } from '@shared/node-v1.0.0';

export default {
	async execute(props: Props, noodlNode: NoodlNode) {
		const { project, backendVersions, environment, dbName } = R.env;
		const { flowEndpoint, flowData, timeout, useServices, selectedService, serviceVersion } = props;

		const backendVersion = backendVersions?.app;
		if (!dbName) {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`);
			log.error('No dbName', R.env);
			return;
		}

		if (flowEndpoint || selectedService) {
			const startTime = log.start();

			log.info(`Nodered ${flowEndpoint || selectedService} props`, { flowEndpoint, flowData });
			//@ts-ignore
			sendOutput(noodlNode, 'executing', true);

			const noderedCreds = R.params.creds?.filter((i) => i.name === 'nodered')?.[0].data;
			if (noderedCreds) {
				let nodeRedUrl = '';

				// Если флаг useServices, то используем ссылку ссответствующего сервиса
				if (useServices) {
					// Получаем ссылку на выбранный сервис
					switch (selectedService) {
						// Сервис по загрузке файлов
						case 'uploadFiles':
							nodeRedUrl = `https://upload-files.services.${serviceVersion}.rolder.app/uploadFiles`;
							break;
						// Сервис по удалению файлов
						case 'deleteFilesByUrl':
							nodeRedUrl = `https://upload-files.services.${serviceVersion}.rolder.app/deleteFilesByUrl`;
							break;
						// Сервис по копированию классов
						case 'copyDBClass':
							nodeRedUrl = `c`;
							break;
						// Следующий сервис
						// ...
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

				const jsonResp = await ky
					.post(nodeRedUrl, {
						headers: {
							Authorization: 'Basic ' + btoa(`${noderedCreds.username}:${noderedCreds.password}`),
						},
						body: formData,
						timeout: timeout, // Vezdexod
					})
					.json();

				//@ts-ignore
				sendOutput(noodlNode, 'result', jsonResp);
				//@ts-ignore
				sendOutput(noodlNode, 'executing', false);
				//@ts-ignore
				sendSignal(noodlNode, 'executed');

				log.info(`Nodered ${flowEndpoint}`, jsonResp);
				log.end(`Nodered: ${flowEndpoint}`, startTime);
			}
		}

		return;
	},
};

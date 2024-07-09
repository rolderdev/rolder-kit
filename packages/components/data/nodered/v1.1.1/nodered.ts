import ky from 'ky';
import type { Props } from './types';
import { sendOutput, sendSignal } from '@packages/port-send';

export default {
	async execute(props: Props) {
		const { project, environment = 'd2' } = window.R.env;
		const { noodlNode, flowEndpoint, flowData, timeout } = props;

		const { dbName } = R.env;
		if (!dbName) {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`);
			log.error('No dbName', R.env);
			return null;
		}

		if (flowEndpoint) {
			const startTime = log.start();

			log.info(`Nodered ${flowEndpoint} props`, { flowEndpoint, flowData });
			//@ts-ignore
			sendOutput(noodlNode, 'executing', true);

			const noderedCreds = R.params.creds?.filter((i) => i.name === 'nodered')?.[0].data;
			if (noderedCreds) {
				const formData = new FormData();
				if (flowData) {
					if (flowData.params) formData.append('params', JSON.stringify(flowData.params));
					if (flowData.data) formData.append('data', JSON.stringify(flowData.data));
					if (flowData.files) flowData.files.map((i) => formData.append(i.name, i));
				}

				const jsonResp = await ky
					.post(`https://${project}.nodered.${environment}.rolder.app/${flowEndpoint}`, {
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
		return null;
	},
};

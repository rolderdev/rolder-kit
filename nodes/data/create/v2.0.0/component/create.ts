import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Props } from '../node/definition';
import kCreate, { type BackendData } from './kCreate';
import type { JsComponent } from '@shared/node-v1.0.0';

export default {
	create: async (p: Props, noodlNode) => {
		if (p.createScheme?.length) {
			// Выясним примерный размер отправляемго запроса.
			let megaBytes = 0;
			for (const scheme of p.createScheme) {
				const size = new TextEncoder().encode(JSON.stringify(scheme.items)).length;
				megaBytes += size / 1024 / 1024;
			}
			log.info(`Create node request size: ${megaBytes} MB`);

			if (megaBytes > 1) {
				log.error(`Create node request size exceeded 1 MB. Got ${megaBytes} MB`);
				R.libs.mantine.MantineError?.('Системная ошибка!', `Create node request size exceeded 1 MB. Got ${megaBytes} MB`);
			}

			sendOutput(noodlNode, 'creating', true);
			const data: BackendData['data'] | undefined = await kCreate(p, p.createScheme);
			sendOutput(noodlNode, 'data', data);
			sendOutput(noodlNode, 'creating', false);
			sendSignal(noodlNode, 'created');
		}
	},
} as JsComponent;

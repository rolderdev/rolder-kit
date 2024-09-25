import { sendOutput } from '@shared/port-send-v1.0.0';
import type { Props } from '../node/definition';
import type { JsComponent } from '@shared/node-v1.0.0';

export default {
	reactive: (p: Props, noodlNode) => {
		if (p.numberDate || p.jsDate) sendOutput(noodlNode, 'string', R.libs.dayjs(p.numberDate || p.jsDate).format(p.format));
	},
} as JsComponent;

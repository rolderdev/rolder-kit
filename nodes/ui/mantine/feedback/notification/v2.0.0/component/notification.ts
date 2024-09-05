import { notifications } from '@mantine/notifications';
import type { Props } from '../node/definition';
import type { JsComponent } from '@shared/node-v1.0.0';

export default {
	send: (p: Props) => {
		const { title, message, color, autoClose, autoCloseTimeout } = p;
		notifications.show({ title, message, color, autoClose: autoClose ? autoCloseTimeout : false });
	},
} as JsComponent;

import { notifications } from '@mantine/notifications';
import type { Props } from '../types';

export default {
	send: (p: Props) => {
		const { title, message, color, autoClose, autoCloseTimeout } = p;
		notifications.show({ title, message, color, autoClose: autoClose ? autoCloseTimeout : false });
	},
};

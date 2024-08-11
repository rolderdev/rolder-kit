import { fetch } from './fetch';
import { handleChanges } from './handleChanges';
import { handleSubscribe } from './handleSubscribe';
import type { Props } from '../types';
import { type InferOutput } from 'valibot';

export default {
	reactive: async (p: Props) => {
		// Запуск или отсановка подписки. Нужно запускать до handleChanges, чтобы можно было сравнить новые данные со старыми.
		//await handleSubscribe(p);
		type Props = InferOutput<typeof p.PropsScheme>;
		const changeState = handleChanges(p);
		console.log(changeState);

		//if (handleChanges(p) && !p.controlled) fetch(p);

		return;
	},
	fetch: async (p: Props) => fetch(p),
};

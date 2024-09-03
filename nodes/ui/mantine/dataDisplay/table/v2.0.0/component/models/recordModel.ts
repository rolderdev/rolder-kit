/* Модель строки. */
import type { Props } from '../../node/definition';

export type TableRecord = { id: string };

export const setRecordIds = (p: Props) => {
	if (p.items) p.store.records = p.items.map((i) => ({ id: i.id }));
	else p.store.records = [];
};

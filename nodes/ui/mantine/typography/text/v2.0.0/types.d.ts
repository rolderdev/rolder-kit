import type { BaseReactProps } from '@shared/node-v1.0.0';
import type { Item } from '@shared/types-v0.1.0';

export type Props = BaseReactProps & {
	sourceType: 'item' | 'value';
	value?: string;
	item?: Item;
	field: string;
};

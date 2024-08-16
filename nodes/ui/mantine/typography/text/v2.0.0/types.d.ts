import { BaseJsProps } from '@shared/node-v1.0.0';
import type { Item } from '@shared/types-v0.1.0';
import type { IFuseOptions } from 'fuse.js';

export type Props = BaseJsProps & {
	fields?: string[];
	minMatchCharLength?: number;
	searchString?: string;
	customOptions?: IFuseOptions<Item>;
	items?: Item[];
};

import { BaseJsProps } from '@packages/node';
import type { Item } from 'types';
import type { IFuseOptions } from 'fuse.js';

export type Props = BaseJsProps & {
	fields?: string[];
	minMatchCharLength?: number;
	searchString?: string;
	customOptions?: IFuseOptions<Item>;
	items?: Item[];
};

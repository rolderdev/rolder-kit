import { BaseJsProps } from '@shared/node-v1.0.0';

export type Props = BaseJsProps & {
	fields?: string[];
	minMatchCharLength?: number;
	searchString?: string;
};

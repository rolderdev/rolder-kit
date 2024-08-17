import { BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps & {
	fields?: string[];
	minMatchCharLength?: number;
	searchString?: string;
};

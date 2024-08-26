import { BaseJsProps } from '@shared/node-v1.0.0';

export type Props = BaseJsProps & {
	source: 'specific' | 'repeater';
	itemId?: string;
	fields?: string[];
};

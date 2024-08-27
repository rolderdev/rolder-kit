import { BaseJsProps } from '@shared/node-v1.0.0';

export type Props = BaseJsProps & BaseProps & { propsStore: BaseProps };

export type BaseProps = {
	source: 'specific' | 'repeater';
	itemId?: string;
	fields?: string[];
};

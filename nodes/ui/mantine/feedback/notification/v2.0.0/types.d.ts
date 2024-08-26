import { BaseJsProps } from '@shared/node-v1.0.0';

export type Props = BaseJsProps & {
	title?: string;
	message: string;
	color?: string;
	autoClose?: boolean;
	autoCloseTimeout?: number;
};

import { BaseReactProps, NoodlNode } from '@packages/node';

export type Props = BaseReactProps & {
	sessionTimeout?: string;
	username?: string;
	password?: string;
};

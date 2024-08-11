import { BaseReactProps } from '@shared/node';
import { Scope } from '@shared/scope';
import type { Item } from '@shared/types';

export type Props = BaseReactProps & {
	useScope: boolean;
	scope?: Scope;
};

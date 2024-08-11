import { BaseReactProps, NoodlNode } from '@packages/node';
import type { Item } from 'types';

export type Props = BaseReactProps & {
	dbName: string;
	backendDevMode?: boolean;
	backendUrl?: string;
	backendPort?: number;
};

export type MutationFnProps = {
	action: 'create' | 'update' | 'delete';
	scheme: {
		dbClass: string;
		items: Item[];
	}[];
	silent?: boolean;
};

import { BaseReactProps, NoodlNode } from '@packages/node';
import type { RxCollectionCreator, RxSchema } from 'rxdb';
import type { Item } from 'types';

export type Props = BaseReactProps & {
	dbName: string;
	collectionsDefinition: Record<string, RxCollectionCreator<any>>;
	multiInstance?: boolean;
	backendDevMode?: boolean;
	backendHost?: string;
	backendPort?: number;
};

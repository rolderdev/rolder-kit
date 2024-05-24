import { BaseReactProps, NoodlNode } from '@packages/node';
import type { RxCollectionCreator, RxSchema } from 'rxdb';
import type { Item } from 'types';

export type Props = BaseReactProps & {
	dbName: string;
	collectionsDefinition: Record<
		string,
		{
			order?: number;
			rxDefinition: RxCollectionCreator<any>;
			fetchScheme?: any;
			postSave?: (item: Item) => void;
		}
	>;
	backendDevMode?: boolean;
	backendHost?: string;
};

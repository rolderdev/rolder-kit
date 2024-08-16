import type { NoodlNode } from '@shared/node-v1.0.0';
import type { Kuzzle } from 'kuzzle-sdk';
import type { RxDatabase } from 'rxdb';

type Rolder = {
	/* states: {
		backend: 'notInitialized' | 'initializing' | 'initialized';
		debug: number;
		signedIn?: boolean;
		devMode: boolean;
	};*/
	env: {
		environment?: string;
		rolderKit?: string;
		project?: string;
		projectVersion?: string;
		dbName?: string;
	};
	/*params: {
		sessionTimeout?: string;
		defaults?: {
			dateFormat: string;
		};
		colorScheme?: 'light' | 'dark';
		creds?: {
			name: string;
			data: any;
		}[];
		backendOptions?: {
			name: string;
			data: any;
		}[];
	};*/
	dbClasses?: {
		[x: string]: DbClass;
	};
	libs: {
		Kuzzle?: Kuzzle;
		//	queryClient?: QueryClient;
		mantine?: {
			MantineError(title: string, message?: string, autoClose?: boolean | number): void;
		};
		/*		dayjs?: typeof Dayjs;
		mutate?(props: {
			action: 'create' | 'update' | 'delete' | 'updateByQuery'; // Vezdexod: updateByQuery
			scheme: any;
			silent?: boolean;
			refresh?: 'wait_for' | 'false'; // Vezdexod
		}): any;
		[name: string]: any;*/
	};
	db?: RxDatabase;
	/*utils: any;
	user?: any; */
};

export type DbClass = {
	version: string;
	states: {
		[name: string]: {
			value: string;
			label: string;
			order?: number;
			color?: string;
		};
	};
};

export type Item = {
	id: string;
	dbClass: string;
	content?: { [key: string]: any };
	states?: { [key: string]: any };
	_kuzzle_info?: {
		author: string;
		createdAt: number;
		updater: string | null;
		updatedAt: number | null;
	};
	user?: User['user'];
	hierarchyData?: {
		[dbClass: string]: {
			scheme: { dbClass: string; filters?: {} };
			fetched?: number;
			total?: number;
			items?: Item[];
			aggregations?: { [x: string]: any };
			error?: string;
		};
	};
};

export type User = {
	user: {
		username?: string;
		id?: string;
		role?: {
			value: string;
			label: string;
		};
	};
};

declare global {
	var R: Rolder;
	var Noodl: NoodlNode;
	/*var HyperDX: any; */
	var log: {
		start(): number;
		end(title: string, startTime: number): void;
		info(title: string, ...args: any): void;
		debug(title: string, ...args: any): void;
		error(title: string, ...args: any): void;
	};
}

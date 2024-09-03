import type { NoodlNode } from '@shared/node-v1.0.0';
import type { Kuzzle } from 'kuzzle-sdk';
import type { RxDatabase, HyperDX, Rxdb } from '@nodes/app-v2.0.0';
import type { Icons, Utils } from 'shared';
import type { Dayjs, Just, Lodash, Nanoid, Numbro, Omgopass, Remeda, Sort, Valibot, Valtio } from 'shared/src/libs';
import type { Mutate, QueryClient } from '@nodes/data-v2.0.0';
import type { Mantine } from '@nodes/mantine-v2.0.0';
import type { Nodes } from '@nodes/use-data-v2.0.0';

type Rolder = {
	states: {
		debug: number;
		backend: 'notInitialized' | 'initializing' | 'initialized';
		/* signedIn?: boolean;
		devMode: boolean; */
	};
	env: {
		environment?: string;
		rolderKit?: string;
		project?: string;
		projectVersion?: string;
		dbName?: string;
	};
	params: {
		//	sessionTimeout?: string;
		defaults?: {
			dateFormat: string;
		};
		//	colorScheme?: 'light' | 'dark';
		creds?: {
			name: string;
			data: any;
		}[];
		backendOptions?: {
			name: string;
			data: any;
		}[];
	};
	dbClasses?: {
		[x: string]: DbClass;
	};
	libs: {
		Kuzzle?: Kuzzle;
		queryClient?: QueryClient;
		mutate?: Mutate;
		rxdb: Rxdb;
		mantine: Mantine;
		just: Just;
		lodash: Lodash;
		remeda: Remeda;
		nanoid: Nanoid;
		sort: Sort;
		valibot: Valibot;
		valtio: Valtio;
		numbro: Numbro;
		generatePassword: Omgopass;
		dayjs: Dayjs;
		icons: Icons;
	};
	db: RxDatabase;
	utils: Utils;
	user?: User;
	items: Map<string, Item>;
	nodes: Nodes;
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
	user?: User['user'];
	_kuzzle_info?: {
		author: string;
		createdAt: number;
		updater: string | null;
		updatedAt: number | null;
	};
} & { [dbClass: string]: Item | Item[] | { id: string } | { id: string }[] } & {
	getRef: (dbClass: string) => Item | Item[] | { id: string } | { id: string }[];
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
	var HyperDX: HyperDX | undefined;
	var log: {
		start(): number;
		end(title: string, startTime: number): void;
		info(title: string, ...args: any): void;
		debug(title: string, ...args: any): void;
		error(title: string, ...args: any): void;
	};
}

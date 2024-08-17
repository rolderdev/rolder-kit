import type { NoodlNode } from '@shared/node-v1.0.0';
//import type { Kuzzle } from 'kuzzle-sdk';
import type { CreateBlob, RxDatabase, HyperDX } from '@nodes/app-v2.0.0';
import type { Icons, Utils } from 'shared';
import type { Dayjs, Just, Nanoid, Numbro, Omgopass, Sort, Valibot } from 'shared/src/libs';

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
	params: {
		//	sessionTimeout?: string;
		defaults?: {
			dateFormat: string;
		};
		/*	colorScheme?: 'light' | 'dark';
		creds?: {
			name: string;
			data: any;
		}[];
		backendOptions?: {
			name: string;
			data: any;
		}[];*/
	};
	dbClasses?: {
		[x: string]: DbClass;
	};
	libs: {
		//Kuzzle?: Kuzzle;
		rxdb: { createBlob: CreateBlob };
		mantine?: {
			MantineError(title: string, message?: string, autoClose?: boolean | number): void;
		};
		just: Just;
		nanoid: Nanoid;
		sort: Sort;
		valibot: Valibot;
		numbro: Numbro;
		generatePassword: Omgopass;
		dayjs: Dayjs;
		icons: Icons;
	};
	db: RxDatabase;
	utils: Utils;
	//user?: any;
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
	var HyperDX: HyperDX | undefined;
	var log: {
		start(): number;
		end(title: string, startTime: number): void;
		info(title: string, ...args: any): void;
		debug(title: string, ...args: any): void;
		error(title: string, ...args: any): void;
	};
}
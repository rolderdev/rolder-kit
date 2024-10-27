import type { HyperDX, Kuzzle, RxDatabase, Rxdb } from '@nodes/app-v2.0.0'
import type { Mantine } from '@nodes/mantine-v2.0.0'
import type { HistoryItem, ItemsHistory, Nodes } from '@nodes/use-data-v2.0.0'
import type { InitState } from '@shared/init-state-v0.1.0'
import type { NoodlNode } from '@shared/node-v1.0.0'
import type { Icons } from 'shared'
import type { Lodash, Nanoid, Omgopass, Remeda, Sort } from 'shared/src/libs'
import type { Dayjs } from 'shared/src/libs/dayjs'
import type { Just } from 'shared/src/libs/just'
import type { Numbro } from 'shared/src/libs/numbro'
import type { Valibot } from 'shared/src/libs/valibot'
import type { Valtio } from 'shared/src/libs/valtio'
import type { Utils } from 'utils'

type Rolder = {
	states: {
		debug: number
		init: { value: InitState } // Реактивное состояние инициализации приложения.
		backend: 'notInitialized' | 'initializing' | 'initialized' // Обратная совместимость.
		/* signedIn?: boolean;
		devMode: boolean; */
	}
	env: {
		environment?: string
		rolderKit?: string
		project?: string
		projectVersion?: string
		dbName?: string
		backendVersions?: { core: string; app: string }
	}
	params: {
		//	sessionTimeout?: string;
		defaults?: {
			dateFormat: string
		}
		//	colorScheme?: 'light' | 'dark';
		creds?: {
			name: string
			data: any
		}[]
		backendOptions?: {
			name: string
			data: any
		}[]
	}
	dbClasses: {
		[x: string]: DbClass
	}
	libs: {
		Kuzzle?: Kuzzle
		rxdb: Rxdb
		mantine: Mantine
		just: Just
		lodash: Lodash
		remeda: Remeda
		deepMutation: any
		nanoid: Nanoid
		sort: Sort
		valibot: Valibot
		valtio: Valtio
		numbro: Numbro
		generatePassword: Omgopass
		dayjs: Dayjs
		icons: Icons
	}
	db: RxDatabase
	utils: Utils
	user?: User
	items: Record<string, Item>
	itemsHistory: ItemsHistory
	nodes: Nodes
}

export type DbClass = {
	versions: number[]
	current: string
	version: string // Обратная совместимость.
	states: {
		[name: string]: {
			value: string
			label: string
			order?: number
			color?: string
		}
	}
}

export type SchemeDbClass = { name: string; version: number } | string

export type Item = {
	id: Readonly<string>
	dbClass: Readonly<string>
	content?: { [key: string]: any }
	states?: { [key: string]: any }
	user?: User['user']
	_kuzzle_info?: {
		author: string
		createdAt: number
		updater: string | null
		updatedAt: number | null
	}
} & { [dbClass: string]: Item | Item[] | { id: string } | { id: string }[] | undefined } & {
	getRef: (dbClass: string) => Item | Item[] | undefined
	getHistory: (count?: number) => HistoryItem[]
	roots: string[]
}

export type User = {
	user: {
		username?: string
		id?: string
		role?: {
			value: string
			label: string
		}
	}
}

declare global {
	var R: Rolder
	var Noodl: NoodlNode
	var HyperDX: HyperDX | undefined
	var log: {
		start(): number
		end(title: string, startTime: number): void
		info(title: string, ...args: any): void
		debug(title: string, ...args: any): void
		error(title: string, ...args: any): void
	}
}

import './css.d.ts'

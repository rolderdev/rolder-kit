import type { SchemeDbClass } from '@shared/types-v0.1.0'
import type { Notification } from '../component/handleSubscribe'
import type { BaseProps, Props } from '../node/definition'

export default (p: Props) =>
	({
		rootId: R.libs.nanoid(8),
		inited: false,
		apiVersion: p.apiVersion,
		fetchScheme: p.fetchScheme,
		controlled: p.controlled,
		subscribe: p.subscribe,
		schemesData: [],
		subscribes: new Map(),
	}) satisfies Store

export type Store = BaseProps & {
	rootId: string
	inited: boolean
	schemesData: SchemeData[]
	subscribes: Subscribes
	socket?: WebSocket
}

type Subscribes = Map<string, { channel: string; notify: (notif: Notification) => void }>

export type SchemeData = {
	scheme: FetchScheme
	schemeHash: string
	path: string
	level: number
	parentId: string
	itemIds: string[]
	fetched: number
	total: number
	aggregations?: { [x: string]: any }
	channel?: string
}

export type FetchScheme = {
	dbName?: string
	dbClass: SchemeDbClass
	filters?: Record<string, unknown>
	sorts: readonly { [path: string]: 'asc' | 'desc' }[]
	history?: number
}

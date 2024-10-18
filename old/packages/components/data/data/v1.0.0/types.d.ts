import { type BaseReactProps, NoodlNode } from '@packages/node'
import type { Item } from 'types'

export type Props = BaseReactProps & {
	backendVersion: string
	dbName: string
	persistData?: boolean
	backendDevMode?: boolean
	backendUrl?: string
	backendPort?: number
	detectOffline?: boolean
	measureTimeout?: number
	offlineLatancy?: number
	offlineJitter?: number
	offlineDownload?: number
}

export type MutationFnProps = {
	action: 'create' | 'update' | 'delete'
	scheme: {
		dbClass: string
		items: Item[]
	}[]
	silent?: boolean
}

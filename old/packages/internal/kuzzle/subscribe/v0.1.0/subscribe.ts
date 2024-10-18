import { dbClassVersion } from '@packages/get-dbclass-version'
import { deepMap } from 'nanostores'
import { getKuzzle } from '../../../utils/getKuzzle/v0.1.0/getKuzzle'
import type { DataScheme } from './types'

export const subs = deepMap<{ [noodlNodeId: string]: string }>({})

export async function subscribe(noodlNodeId: string, dataScheme: DataScheme) {
	const { dbName } = window.R.env
	const { dbClass, filters } = dataScheme

	const K = await getKuzzle()
	if (!K) {
		return
	}

	const dbClassV = dbClassVersion(dbClass)
	if (!dbClassV) {
		return
	}

	await unSubscribe(noodlNodeId, dbClass)
	setTimeout(() => {
		if (dbName)
			K.realtime
				.subscribe(dbName, dbClassV, {}, (notif) => {
					if (notif.type !== 'document') return
					R.libs.queryClient?.invalidateQueries({ queryKey: [dataScheme] })
					log.info(`Subscribe - ${notif.action} ${dbClass}: `, notif.result)
				})
				.then((room) => {
					subs.setKey(noodlNodeId, room)
					log.info(`Subscribed to ${dbClass} (filters skipped)`, filters)
				})
				.catch((error) => console.log(`Subscribe error`, error))
	}, 500)
}

export async function unSubscribe(noodlNodeId: string, dbClass: string) {
	const K = await getKuzzle()
	if (!K) {
		return
	} else {
		try {
			const room = subs.get()[noodlNodeId]
			if (room) {
				await K.realtime.unsubscribe(room)
				subs.setKey(noodlNodeId, '')
				log.info(`Unsubscribed from ${dbClass}`)
			} else subs.setKey(noodlNodeId, '')
		} catch {} // ignore duplicated unsubs
	}
}

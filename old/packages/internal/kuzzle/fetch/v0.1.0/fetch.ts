import { dbClassVersion } from '@packages/get-dbclass-version'
import { getKuzzle } from '@packages/get-kuzzle'
import flush from 'just-flush'
import type { Item } from 'types'
import fetchUsers from './src/fetchUsers'
import type { Props } from './types'

export async function kuzzleFetch(props: Props): Promise<{ items: Item[]; total: number; aggregations: any } | void> {
	const { dbName } = R.env
	const { dbClass, filters, sorts, querySize: size, searchAfter, getUsers, aggQuery: aggregations } = props

	const Kuzzle = await getKuzzle()
	if (!Kuzzle) {
		return
	}
	const dbClassV = dbClassVersion(dbClass)
	if (!dbClassV) {
		return
	}

	const startTime = log.start()

	if (dbName && dbClass && dbClassV) {
		const sort = [...(sorts || []), { _id: 'asc' }]

		try {
			await Kuzzle.connect()
			const results = await Kuzzle.document.search(
				dbName,
				dbClassV,
				{ query: filters, sort, search_after: searchAfter, aggregations },
				{ lang: 'koncorde', size }
			)
			let rItems = results.hits.map((i) => ({ ...i._source, id: i._id })) as Item[]

			if (getUsers) {
				const userIds = flush(rItems?.filter((i) => i.user?.id).map((i) => i.user?.id))
				if (userIds?.length) rItems = await fetchUsers(userIds, rItems)
			}

			log.info('items', rItems)

			return { items: rItems, total: results.total, aggregations: results.aggregations }
		} catch (e: any) {
			R.libs.mantine?.MantineError('Системная ошибка!', `Fetch ${dbClass} error: ${e.message}`)
			log.error(`Fetch ${dbClass} error`, e)
		}
	} else {
		R.libs.mantine?.MantineError('Системная ошибка!', `Fetch ${dbClass} error: 'There are empty required props'`)
		log.error('There are empty required props', { dbName, dbClass })
	}

	log.end(`Fetch ${dbClass}`, startTime)
}

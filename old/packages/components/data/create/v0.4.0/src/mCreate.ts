import { dbClassVersion } from '@packages/get-dbclass-version'
import { getKuzzle } from '@packages/get-kuzzle'
import type { ArgsDocumentControllerCreate } from 'kuzzle-sdk'
import type { Item } from 'types'
import type { CreateScheme } from '../types'

export default async (createScheme: CreateScheme): Promise<Item[] | void> => {
	const K = await getKuzzle()
	if (!K) return

	const { dbName } = R.env
	if (!dbName) {
		R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
		log.error('No dbName', R.env)
		return
	}

	const { dbClass, items } = createScheme

	const options: ArgsDocumentControllerCreate = { refresh: 'wait_for' }

	const dbClassV = dbClassVersion(dbClass)
	const kItems = items.map((i) => ({ body: i }))

	const startTime = log.start()
	log.info(`mCreate ${dbClassV} props`, { dbClass, kItems, options })

	if (dbName && dbClassV)
		return K.document
			.mCreate(dbName, dbClassV, kItems, { ...options, retryOnConflict: 3 })
			.then((kResponse) => {
				const rItems = kResponse.successes.map((kItem) => ({ id: kItem._id, ...kItem._source })) as Item[]

				if (kResponse.errors.length > 0) {
					R.libs.mantine?.MantineError?.(
						'Системная ошибка!',
						`Kuzzle mCreate errors at dbClass ${dbClassV}: ${JSON.stringify(kResponse.errors)}`
					)
					log.error(`Kuzzle mCreate errors at dbClass ${dbClassV}`, kResponse.errors)
				}

				log.info(`${dbClassV} mCreated`, rItems)
				log.end(`${dbClassV} mCreate`, startTime)

				return rItems
			})
			.catch((error) => {
				R.libs.mantine?.MantineError?.('Системная ошибка!', `Kuzzle mCreate ${dbClassV}: ${error.message}`)
				log.error(`Kuzzle mCreate ${dbClassV}:`, error)
			})
}

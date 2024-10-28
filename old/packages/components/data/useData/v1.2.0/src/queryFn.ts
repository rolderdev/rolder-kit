import { getKuzzle } from '@packages/get-kuzzle'
import type { Data, FetchScheme, Props } from '../types'

export default async function (p: { fetchScheme: FetchScheme; props: Props }) {
	const { fetchScheme, props } = p
	const { searchEnabled, searchString } = props

	const K = await getKuzzle()
	if (!K) {
		return null
	}
	const { dbName } = R.env
	if (!dbName) {
		R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
		log.error('No dbName', R.env)
		return null
	}

	const startTime = log.start()
	log.info(`UseData props: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, props)

	let response = {} as { result: Data }

	console.log('Улетает в kuzzle query', { controller: 'rolder', action: 'search', dbName, searchString, fetchScheme })

	if (searchEnabled && searchString) {
		response = await K.query({ controller: 'rolder', action: 'search', dbName, searchString, fetchScheme })
		log.info(`UseData founded ${fetchScheme.map((i) => i.dbClass).join(', ')}`, response.result)
		log.end(`UseData search spent time for ${fetchScheme.map((i) => i.dbClass).join(', ')}`, startTime)
	} else {
		response = await K.query({ controller: 'rolder', action: 'fetch', dbName, fetchScheme })
		log.info(`UseData fetched ${fetchScheme.map((i) => i.dbClass).join(', ')}`, response.result)
		log.end(`UseData fetch spent time for ${fetchScheme.map((i) => i.dbClass).join(', ')}`, startTime)
	}

	const dataEntries = Object.entries(response.result)
	if (dataEntries.some((i) => i[1].error)) {
		dataEntries.forEach((entry) => {
			if (entry[1]?.error) {
				R.libs.mantine?.MantineError('Системная ошибка!', `UseData error at "${entry[0]}": ${entry[1]?.error}`)
				log.error(`UseData error at "${entry[0]}": ${entry[1]?.error}`)
			}
		})
		return {}
	} else return response.result
}

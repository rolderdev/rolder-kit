import type { JSONObject, ResponsePayload } from '@nodes/app-v2.0.0'
import { getDbClassName } from '@shared/db-class'
import { getKuzzle } from '@shared/get-kuzzle'
import type { Props } from '../node/definition'
import type { DeleteScheme } from '../node/validtaion'

export type BackendData = {
	data: { [dbClass: string]: { ids: string[]; count: number } }
	error?: { message: string; dbClass?: string; metaData: any }
}

export default async (p: Props, deleteScheme: DeleteScheme) => {
	const K = await getKuzzle()
	if (!K) return

	const MantineError = R.libs.mantine?.MantineError

	const { dbName } = R.env
	if (!dbName) {
		MantineError?.('Системная ошибка!', 'No dbName at R.env')
		log.error('No dbName', R.env)
		return
	}

	const startTime = log.start()
	log.info(`delete props: ${deleteScheme.map((i) => getDbClassName(i.dbClass)).join(', ')}`, p)

	let response: ResponsePayload<JSONObject> | undefined

	try {
		response = await K.query({ controller: 'rolder', action: `delete_${p.apiVersion}`, dbName, deleteScheme })

		// Отловим ошибки.
	} catch (e: any) {
		log.error('delete query error.', e)
		MantineError?.('Системная ошибка!', `delete query error: ${e.message}`)
		return
	}

	const backendData = response?.result as BackendData

	if (backendData.error) {
		log.error('Kuzzle error.', backendData.error)
		MantineError?.('Системная ошибка!', `Kuzzle error. ${backendData.error.message}`)
	}

	log.info(`delete: ${deleteScheme?.map((i) => getDbClassName(i.dbClass)).join(', ')}`, backendData)
	log.end(`delete: ${deleteScheme?.map((i) => getDbClassName(i.dbClass)).join(', ')}`, startTime)

	return backendData.data
}

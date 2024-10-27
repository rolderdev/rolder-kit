// Качает конфиг с бекенда и устанавливает его в локальную БД.

import type { Kuzzle } from 'kuzzle-sdk'

export default async function (kuzzle: Kuzzle, online: boolean) {
	const configState = await R.db?.addState('config')

	if (!online && !configState.dbClasses) {
		R.libs.mantine?.MantineError?.('Системная ошибка!', 'Нужно быть в сети для первого запуска приложения')
		return
	}

	if (online) {
		const startTime = log.start()

		try {
			const r = await kuzzle.query({ controller: 'rolder', action: 'fetchConfig_v1' })

			if (r.result.backendVersions) R.env.backendVersions = r.result.backendVersions

			if (r.result.creds?.error) log.error('Fetch dbClasses error', r.result.dbClasses?.error)
			if (r.result.creds?.error) log.error('Fetch system creds error', r.result.creds?.error)
			if (r.result.creds?.error) log.error('Fetch options error', r.result.options?.error)

			await R.db?.states.config.set('dbClasses', () => r.result.dbClasses)
			await R.db?.states.config.set('creds', () => r.result.creds)
			await R.db?.states.config.set('options', () => r.result.options)
		} catch (e: any) {
			if (e.code === 117506049) R.libs.Kuzzle
			R.libs.mantine?.MantineError('Системная ошибка!', `Fetch config error: ${JSON.stringify(e, null, '\t')}`)
			console.error('fetchConfig error', e)
			return
		}

		log.end('Fetch config', startTime)
	}

	const { dbClasses, creds, options } = configState

	R.dbClasses = dbClasses
	R.params.creds = creds
	R.params.backendOptions = options
}

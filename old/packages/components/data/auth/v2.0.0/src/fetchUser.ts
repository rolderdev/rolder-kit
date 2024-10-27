import { getKuzzle } from '@packages/get-kuzzle'

export default async function () {
	const { dbName } = R.env
	if (!dbName) {
		log.error('DB name is empty')
		return
	}
	const K = await getKuzzle()
	if (!K) return

	const startTime = log.start()

	try {
		const user = await K.auth.getCurrentUser()
		const r = await K.query({ controller: 'rolder', action: 'fetchUser', dbName, user })

		if (r.result.userErrors) {
			R.libs.mantine?.MantineError('Системная ошибка!', `Fetch user error: ${JSON.stringify(r.result.userErrors, null, '\t')}`)
			log.error('Fetch user error', r.result.userErrors)
		}

		await R.db?.states.auth.set('user', () => r.result.user)
	} catch (error) {
		console.error('fetchUser error', error)
	}

	log.end('Fetch user', startTime)
}

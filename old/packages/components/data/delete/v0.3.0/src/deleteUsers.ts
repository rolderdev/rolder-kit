import { getKuzzle } from '@packages/get-kuzzle'

export default async (deleteUserIds: string[]): Promise<any> => {
	const K = await getKuzzle()
	if (!K) return

	const startTime = log.start()
	log.info(`deleteUsers props`, { deleteUserIds })

	await K.security
		.mDeleteUsers(deleteUserIds, { refresh: 'wait_for' })
		.then((kResponse) => {
			log.info(`deleteUsers`, kResponse)
			log.end(`deleteUsers`, startTime)
		})
		.catch((error) => {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `Kuzzle deleteUsers: ${error.message}`)
			log.error(`deleteUsers error`, error)
		})
}

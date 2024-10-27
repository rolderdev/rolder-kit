import '@shared/types-v0.1.0'

export async function getKuzzle() {
	const { Kuzzle } = R.libs
	if (!Kuzzle) {
		R.libs.mantine?.MantineError('Системная ошибка!', 'No Kuzzle instance at R.libs')
		log.error('No Kuzzle instance', R.libs)
		return false
	}

	const connected = R.db?.states.network.connected
	if (connected) {
		try {
			await Kuzzle.connect()
			return Kuzzle
		} catch (e) {
			return false
		}
	}
	return false
}

import { getKuzzle } from '@packages/get-kuzzle';

export default async function () {
	const { dbName } = R.env;
	if (!dbName) {
		log.error('DB name is empty');
		return;
	}
	const K = await getKuzzle();
	if (!K) return;

	const startTime = log.start();

	try {
		const user = await K.auth.getCurrentUser();
		const r = await K.query({
			controller: 'rolder',
			action: 'fetchUserAndSystemCreds',
			dbName,
			user,
		});

		if (r.result.creds?.error) {
			R.libs.mantine?.MantineError('Системная ошибка!', `Fetch system creds error: ${r.result.creds?.error}`);
			log.error('Fetch system creds error', r.result.creds?.error);
		}

		if (r.result.userErrors) {
			R.libs.mantine?.MantineError('Системная ошибка!', `Fetch user error: ${JSON.stringify(r.result.userErrors, null, '\t')}`);
			log.error('Fetch user error', r.result.userErrors);
		}

		await R.db?.states.auth.set('creds', () => r.result.creds);
		await R.db?.states.auth.set('user', () => r.result.user);
		await R.db?.states.auth.set('dbClasses', () => r.result.dbClasses);
	} catch (error) {
		console.error('fetchUserAndSystemCreds error', error);
	}

	log.end('Fetch user and system creds', startTime);
}

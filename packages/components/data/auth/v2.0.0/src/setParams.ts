export default async function () {
	const user = await R.db?.states.auth.get('user');
	const creds = await R.db?.states.auth.get('creds');
	const dbClasses = await R.db?.states.auth.get('dbClasses');

	R.user = user;
	R.params.creds = creds;
	R.dbClasses = dbClasses;
}

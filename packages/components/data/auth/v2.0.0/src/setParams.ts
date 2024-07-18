export default async function () {
	const { token, user, creds, dbClasses } = R.db?.states.auth.get();

	if (R.libs.Kuzzle) R.libs.Kuzzle.jwt = token;
	R.user = user;
	R.params.creds = creds;
	R.dbClasses = dbClasses;
}

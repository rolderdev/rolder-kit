export default function () {
	const { token, user } = R.db?.states.auth.get()

	if (R.libs.Kuzzle) R.libs.Kuzzle.jwt = token
	R.user = user
}

export default function () {
	const authState = R.db?.states.auth.get()
	const token = authState?.token
	const user = authState?.user

	if (R.libs.Kuzzle && token) R.libs.Kuzzle.jwt = token
	if (user) R.user = user
}

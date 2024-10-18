import set from 'just-safe-set'
import type { Item } from 'types'

export default async function (userIds: string[], rItems: Item[]) {
	const { Kuzzle } = window.R.libs
	if (!Kuzzle) {
		log.error('No Kuzzle instance')
		return
	}

	const kUsers = await Kuzzle.security.mGetUsers(userIds)
	let rUsers = kUsers.map((k: any) => ({ ...k._source, id: k._id }))
	await Promise.all(rUsers.map((i: any) => Kuzzle.security.getCredentials('local', i.id))).then(
		(r) =>
			(rUsers = rUsers.map((i: any, idx: number) => {
				set(i, ['credentials', 'local', 'username'], r[idx].username)
				return i
			}))
	)
	rItems = rItems?.map((rItem) => {
		const rUser = rUsers?.find((i_2: any) => i_2.id === rItem.user?.id)
		if (rUser) rItem.user = rUser
		return rItem
	})
	return rItems
}

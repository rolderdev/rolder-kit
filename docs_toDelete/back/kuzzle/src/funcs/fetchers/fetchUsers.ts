import set from 'just-safe-set';
import { EmbeddedSDK } from 'kuzzle';
import type { Item } from 'src/types';

export default async function (sdk: EmbeddedSDK, userIds: string[], rItems: Item[]) {
	const kUsers = await sdk.security.mGetUsers(userIds);
	let rUsers = kUsers.map((k) => ({ ...k._source, id: k._id, dbClass: 'user' }));
	await Promise.all(rUsers.map((i) => sdk.security.getCredentials('local', i.id))).then(
		(r) =>
			(rUsers = rUsers.map((i: any, idx: number) => {
				set(i, ['credentials', 'local', 'username'], r[idx].username);
				return i;
			}))
	);
	rItems = rItems?.map((rItem) => {
		const rUser = rUsers?.find((i) => i.id === rItem.user?.id);
		if (rUser) rItem.user = rUser;
		return rItem;
	});
	return rItems;
}

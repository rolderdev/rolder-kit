export default async function (userIds: string[], rItems: RItem[]) {
    const { Kuzzle } = window.R.libs
    const { set } = window.R.libs.just

    const kUsers = await Kuzzle.security.mGetUsers(userIds)
    let rUsers = kUsers.map((k: any) => ({ ...k._source, id: k._id }))
    await Promise.all(rUsers.map((i: any) => Kuzzle.security.getCredentials('local', i.id)))
        .then((r) => rUsers = rUsers.map((i: any, idx: number) => {
            set(i, ['credentials', 'local', 'username'], r[idx].username)
            return i
        }))
    rItems = rItems?.map(rItem => {
        const rUser = rUsers?.find((i_2: any) => i_2.id === rItem.user?.id)
        if (rUser) rItem.user = rUser
        return rItem
    })
    return rItems
}
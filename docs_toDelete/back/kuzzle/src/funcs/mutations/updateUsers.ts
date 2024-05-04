import { MutateProps, MutateResult } from "src/types"

export default async function updateUsers(props: MutateProps): Promise<MutateResult | void> {
  const { sdk, items } = props
  try {
    let userItems = []

    items.map((user: any) => {
      const content = { ...user.content, credentials: { local: { notSecret: user.credentials?.local.notSecret } } }
      let credentials = user.credentials
      delete credentials?.local.notSecret
      userItems.push({ id: user.id, content, credentials })
    })

    let kUsers = await Promise.all(userItems.map(i => {
      console.log('user', JSON.stringify(i))
      sdk.security.updateCredentials('local', i.id, i.credentials?.local)
      return sdk.security.updateUser(i.id, { content: i.content, credentials: i.credentials }, { refresh: 'wait_for' })
    }))

    kUsers = kUsers.map((i, idx) => {
      i._source.credentials.local.username = userItems[idx].credentials?.local.username
      return i
    })

    const rUsers = kUsers.map(i => ({ id: i._id, ...i._source }))

    return { count: rUsers.length, items: rUsers }
  } catch (e: any) {
    console.error(`update users error`, e)
    return { error: e.message }
  }
}
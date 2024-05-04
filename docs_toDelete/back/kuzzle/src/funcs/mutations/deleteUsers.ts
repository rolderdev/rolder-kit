import { DeleteProps, DeleteResult } from "src/types"

export default async function deleteUsers(props: DeleteProps): Promise<DeleteResult | void> {
  const { sdk, ids } = props
  try {
    const kResponse = await sdk.security.mDeleteUsers(ids, { refresh: 'wait_for', retryOnConflict: 3 })
    return { response: kResponse }
  } catch (e: any) {
    console.error(`delete users error`, e)
    return { error: e.message }
  }
}
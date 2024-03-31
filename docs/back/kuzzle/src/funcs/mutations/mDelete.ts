import { DeleteProps, DeleteResult } from "../../types";

export default async function mDelete(props: DeleteProps): Promise<DeleteResult | void> {
  const { sdk, dbName, dbClass, ids } = props

  try {
    const kResponse = await sdk.document.mDelete(dbName, dbClass, ids, { refresh: 'wait_for', retryOnConflict: 3 })
    if (kResponse.errors.length > 0) {
      console.error(`mDelete ${dbClass} error`, kResponse.errors)
      return { error: JSON.stringify(kResponse.errors) }
    }

    return { count: kResponse.successes.length, response: kResponse }
  } catch (e: any) {
    console.error(`mDelete ${dbClass} error`, e)
    return { error: e.message }
  }
}
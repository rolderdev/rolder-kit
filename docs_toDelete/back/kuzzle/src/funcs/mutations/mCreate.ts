import { Item, MutateProps, MutateResult } from "../../types";

export default async function mCreate(props: MutateProps): Promise<MutateResult | void> {
  const { sdk, dbName, dbClass, items } = props

  try {
    const kItems = items.map(i => ({ body: i }))

    const kResponse = await sdk.document.mCreate(dbName, dbClass, kItems, { refresh: 'wait_for', retryOnConflict: 3 })
    if (kResponse.errors.length > 0) {
      console.error(`mCreate ${dbClass} error`, kResponse.errors)
      return { error: JSON.stringify(kResponse.errors) }
    }

    const rItems = kResponse.successes.map(kItem => ({ id: kItem._id, ...kItem._source })) as Item[]

    return { count: rItems.length, items: rItems }
  } catch (e: any) {
    console.error(`mCreate ${dbClass} error`, e)
    return { error: e.message }
  }
}
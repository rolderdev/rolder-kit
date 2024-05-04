import dayjs from "dayjs";
import { Item, MutateProps, MutateResult } from "../../types";

export default async function mUpdate(props: MutateProps): Promise<MutateResult | void> {
  const { sdk, dbName, dbClass, items, silent, history } = props

  try {
    const kItems = items.map(i => {
      const kItem: any = { body: i, _id: i.id }
      delete kItem.body.id
      return kItem
    })

    if (history) {
      const results = await sdk.document.mGet(dbName, dbClass, kItems.map(i => i._id))
      const historyKItems = results.successes.map(i => ({
        body: {
          id: i._id,
          timestamp: dayjs().valueOf(),
          item: { ...i._source }
        }
      }))
      const kResponse = await sdk.document.mCreate('history', dbClass, historyKItems, { refresh: 'wait_for', retryOnConflict: 3 })
      if (kResponse.errors.length > 0) {
        console.error(`mCreate history ${dbClass} error`, kResponse.errors)
        return { error: JSON.stringify(kResponse.errors) }
      }
    }

    const kResponse = await sdk.document.mUpdate(dbName, dbClass, kItems, { refresh: 'wait_for', retryOnConflict: 3, silent })
    if (kResponse.errors.length > 0) {
      console.error(`mUpdate ${dbClass} error`, kResponse.errors)
      return { error: JSON.stringify(kResponse.errors) }
    }

    const rItems = kResponse.successes.map(kItem => ({ id: kItem._id, ...kItem._source })) as Item[]

    return { count: rItems.length, items: rItems }
  } catch (e: any) {
    console.error(`mCreate ${dbClass} error`, e)
    return { error: e.message }
  }
}
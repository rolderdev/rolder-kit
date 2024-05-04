import flush from "just-flush";
import fetchUsers from "./fetchUsers";
import { DbClasses, FetchProps, FetchResult, Item } from "src/types";
import { sort as fastSort } from 'fast-sort'

export default async function fetch(props: FetchProps, dbClasses: DbClasses): Promise<FetchResult | void> {
  const { sdk, dbName, dbClass, filters, sorts, size, searchAfter, getUsers, aggregations, history } = props

  const dbClassV = dbClass === 'user' ? 'user' : `${dbClass}_v${dbClasses[dbClass].version}`
  const sort = Array.isArray(sorts)
    ? [...(sorts || []), { _id: "asc" }]
    : sorts

  try {
    const results = await sdk.document.search(
      dbName,
      dbClassV,
      { aggregations, query: filters, search_after: searchAfter, sort },
      { lang: "koncorde", size },
    )

    let items = results.hits.map((i) => ({ ...i._source, id: i._id, dbClass })) as Item[]

    if (history) {
      const historyResults = await sdk.document.search(
        'history',
        dbClassV,
        { query: { in: { id: items.map(i => i.id) } } },
        { lang: "koncorde", size: history }
      )

      items = items.map(item => {
        const historyItems = historyResults.hits.filter(i => i._source.id === item.id)
          .map((i) => ({ timestamp: i._source.timestamp, item: i._source.item })) as Item['history']

        if (historyItems?.length) item.history = fastSort(historyItems).desc(i => i.timestamp)
        return item
      })
    }

    //===================================== hooks ===========================================

    //===================================== hooks ===========================================

    if (getUsers) {
      const userIds = flush(items?.filter((i) => i.user?.id).map((i) => i.user?.id))
      if (userIds?.length) items = await fetchUsers(sdk, userIds, items)
    }

    return { aggregations: results.aggregations, fetched: items.length, items, total: results.total }

  } catch (e: any) {
    console.error(`Fetch ${dbClassV} error`, e)
    return { error: e.message }
  }
}

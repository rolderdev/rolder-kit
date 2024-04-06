import { EmbeddedSDK, KuzzleRequest } from "kuzzle";
import fetch from "../funcs/fetchers/fetch";
import { BaseFetchScheme, Data, DbClasses, SearchScheme } from "../types";
import prepareSearchScheme from "../funcs/schemes/prepareSearchScheme";
import prepareRefScheme from "../funcs/schemes/prepareRefScheme";
import directSetRefs from "../funcs/refs/directSetRefs";
import unique from "just-unique";
import applyFilters from '../funcs/filters/applyFilters'
import prepareScheme from "../funcs/schemes/prepareFetchScheme"

export default async function search(request: KuzzleRequest, sdk: EmbeddedSDK, dbClasses: DbClasses) {
  const dbName = request.getString("dbName")
  const searchString = request.getString("searchString")
  const initialSchemes = request.getArray("fetchScheme") as SearchScheme[]
  const preparedFetchSchemes = prepareScheme(initialSchemes)

  let data = {} as Data

  let schemeHasError = false
  initialSchemes.map(i => {
    preparedFetchSchemes.map(ps => {
      if (ps[i.dbClass]?.error) {
        data[i.dbClass] = ps[i.dbClass].error
        schemeHasError = true
      }
    })
  })

  if (!schemeHasError) {
    const validatedFetchSchemes = preparedFetchSchemes as BaseFetchScheme[]
    const preparedSearchSchemes = prepareSearchScheme(initialSchemes, searchString)

    async function execute() {
      await Promise.all(
        preparedSearchSchemes.filter(i => i.searchFields).map((preparedScheme) =>
          fetch({ dbName, sdk, ...preparedScheme }, dbClasses)
            .then((fr) => {
              if (fr) { data[preparedScheme.dbClass] = fr }
            })
        )
      )

      const refSchemes = prepareRefScheme(validatedFetchSchemes.filter(i => i.searchFields), data)

      const fetchSchemes = [
        ...validatedFetchSchemes.filter(i => !refSchemes.map(i => i.dbClass).includes(i.dbClass) && !Object.keys(data).includes(i.dbClass)),
        ...refSchemes
      ]

      const orders = unique(fetchSchemes.map((i) => i.order)).sort()
      const schemeArrays = orders.map((order) => fetchSchemes.filter((i) => i.order === order))

      for (const schemeArray of schemeArrays) {
        await Promise.all(schemeArray.map((fs) =>
          fetch({ dbName, sdk, ...applyFilters(fs, data) }, dbClasses)
            .then((fr) => { if (fr) { data[fs.dbClass] = fr } })
        ))
      }

      data = directSetRefs(data, initialSchemes)
    }

    await execute()
  }

  return data
}

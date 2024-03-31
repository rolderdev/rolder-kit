import { EmbeddedSDK, KuzzleRequest } from "kuzzle";
import fetch from "../funcs/fetchers/fetch";
import { Data, SearchScheme } from "../types";
import prepareSearchScheme from "../funcs/schemes/prepareSearchScheme";
import prepareRefScheme from "../funcs/schemes/prepareRefScheme";
import directSetRefs from "../funcs/refs/directSetRefs";
import unique from "just-unique";
import applyFilters from '../funcs/filters/applyFilters'
import prepareScheme from "../funcs/schemes/prepareFetchScheme"

export default async function search(request: KuzzleRequest, sdk: EmbeddedSDK) {
  const dbName = request.getString("dbName")
  const searchString = request.getString("searchString")
  const initialSchemes = request.getArray("fetchScheme") as SearchScheme[]
  const preparedFetchSchemes = prepareScheme(initialSchemes)
  const preparedSearchSchemes = prepareSearchScheme(initialSchemes, searchString)

  async function execute() {
    let data = {} as Data

    await Promise.all(
      preparedSearchSchemes.filter(i => i.searchFields).map((preparedScheme) =>
        fetch({ dbName, sdk, ...preparedScheme })
          .then((fr) => {
            if (fr) { data[preparedScheme.dbClass.split("_")[0]] = fr }
          })
      )
    )

    const refSchemes = prepareRefScheme(preparedFetchSchemes.filter(i => i.searchFields), data)

    const fetchSchemes = [
      ...preparedFetchSchemes.filter(i => !refSchemes.map(i => i.dbClass).includes(i.dbClass) && !Object.keys(data).includes(i.dbClass.split("_")[0])),
      ...refSchemes
    ]

    const orders = unique(fetchSchemes.map((i) => i.order)).sort()
    const schemeArrays = orders.map((order) => fetchSchemes.filter((i) => i.order === order))

    for (const schemeArray of schemeArrays) {
      await Promise.all(schemeArray.map((fs) =>
        fetch({ dbName, sdk, ...applyFilters(fs, data) })
          .then((fr) => { if (fr) { data[fs.dbClass.split("_")[0]] = fr } })
      ))
    }

    data = directSetRefs(data, initialSchemes)

    return data
  }

  return execute()
}

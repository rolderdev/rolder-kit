import { EmbeddedSDK, KuzzleRequest } from "kuzzle"
import fetch from '../funcs/fetchers/fetch'
import unique from "just-unique"
import directSetRefs from "../funcs/refs/directSetRefs"
import prepareScheme from "../funcs/schemes/prepareFetchScheme"
import { BaseFetchScheme, Data } from "../types"
import applyFilters from '../funcs/filters/applyFilters'

export default async function f(request: KuzzleRequest, sdk: EmbeddedSDK) {  
  const dbName = request.getString("dbName")
  const baseSchemes = request.getArray("fetchScheme") as BaseFetchScheme[]
  const preparedSchemes = prepareScheme(baseSchemes)

  const orders = unique(preparedSchemes.map((i) => i.order)).sort()
  const schemeArrays = orders.map((order) => preparedSchemes.filter((i) => i.order === order))

  async function execute() {
    let data = {} as Data
    for (const schemeArray of schemeArrays) {
      await Promise.all(schemeArray.map((fs) =>
        fetch({ dbName, sdk, ...applyFilters(fs, data) })
          .then((fr) => { if (fr) { data[fs.dbClass.split("_")[0]] = fr } })
      ))
      data = directSetRefs(data, preparedSchemes)
    }
    return data
  }

  return execute()
}

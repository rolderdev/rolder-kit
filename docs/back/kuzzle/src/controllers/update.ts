import { EmbeddedSDK, KuzzleRequest } from "kuzzle"
import unique from "just-unique"
import prepareScheme from "../funcs/schemes/prepareMutatesScheme"
import { MutateScheme, MutateData } from "../types"
import mUpdate from "../funcs/mutations/mUpdate"
import applyItemsFunc from '../funcs/mutations/applyItemsFunc'
import updateUsers from "../funcs/mutations/updateUsers"

export default async function f(request: KuzzleRequest, sdk: EmbeddedSDK) {
  const dbName = request.getString("dbName")
  const baseSchemes = request.getArray("scheme") as MutateScheme[]
  const preparedSchemes = prepareScheme(baseSchemes)
  const orders = unique(preparedSchemes.map((i) => i.order)).sort()
  const schemeArrays = orders.map((order) => preparedSchemes.filter((i) => i.order === order))

  async function execute() {
    let data = {} as MutateData
    for (const schemeArray of schemeArrays) {
      await Promise.all(schemeArray.map((ms) =>
        ms.dbClass === 'user'
          ? updateUsers({ dbName, sdk, ...applyItemsFunc(ms, data) }).then(mr => { if (mr) data.user = mr })
          : mUpdate({ dbName, sdk, ...applyItemsFunc(ms, data) }).then(mr => {
            if (mr) data[ms.dbClass.split("_")[0]] = mr
          })
      ))
    }

    return data
  }

  return execute()
}

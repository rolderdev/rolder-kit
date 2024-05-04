import { EmbeddedSDK, KuzzleRequest } from "kuzzle"
import unique from "just-unique"
import prepareScheme from "../funcs/schemes/prepareMutatesScheme"
import applyIdsFunc from '../funcs/mutations/applyIdsFunc'
import mDelete from "../funcs/mutations/mDelete"
import deleteUsers from "../funcs/mutations/deleteUsers"
import { DeleteData, DeleteScheme } from "src/types"

export default async function f(request: KuzzleRequest, sdk: EmbeddedSDK) {
  const dbName = request.getString("dbName")
  const baseSchemes = request.getArray("scheme") as DeleteScheme[]
  const preparedSchemes = prepareScheme(baseSchemes)
  const orders = unique(preparedSchemes.map((i) => i.order)).sort()
  const schemeArrays = orders.map((order) => preparedSchemes.filter((i) => i.order === order))

  async function execute() {
    let data = {} as DeleteData
    for (const schemeArray of schemeArrays) {
      await Promise.all(schemeArray.map((ms) =>
        ms.dbClass === 'user'
          ? deleteUsers({ dbName, sdk, ...applyIdsFunc(ms, data) }).then(mr => { if (mr) data.user = mr })
          : mDelete({ dbName, sdk, ...applyIdsFunc(ms, data) }).then(mr => {
            if (mr) data[ms.dbClass.split("_")[0]] = mr
          })
      ))
    }

    return data
  }

  return execute()
}

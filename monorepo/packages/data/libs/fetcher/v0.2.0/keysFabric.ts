import { ArgsDocumentControllerSearch, JSONObject } from "kuzzle-sdk"
import { dbClassVersion, dbVersion } from "../../../utils/getVersion/v0.3.0/getVersion"
import { setFilters, setOptions, setSorts } from "../../../utils/setDefaults/v0.3.0/setDefaults"

export function getStoreKeys(keysDef: KeysDef) {
    let keys = [dbVersion(), keysDef.dbClass, keysDef.noodlNodeId]
    keys.push(keysDef.filters ? JSON.stringify(keysDef.filters) : '')
    keys.push(keysDef.sorts ? JSON.stringify(keysDef.sorts) : '')
    keys.push(keysDef.options ? JSON.stringify(keysDef.options) : '')
    keys.push(keysDef.references ? JSON.stringify(keysDef.references) : '')
    keys.push(keysDef.backReferences ? JSON.stringify(keysDef.backReferences) : '')
    keys.push(keysDef.getUsers ? JSON.stringify(keysDef.getUsers) : '')
    return keys
}

type KuzzleFetchKeys = [string, string, JSONObject, ArgsDocumentControllerSearch]
export function getKuzzleFetchKeys(storeKeys: (string | number)[]): KuzzleFetchKeys {
    const dbClass = storeKeys[1] as string
    let keys: any = [storeKeys[0], dbClassVersion(dbClass)]
    const filters = storeKeys[3] ? JSON.parse(storeKeys[3] as string) : {}
    const sorts = storeKeys[4] ? JSON.parse(storeKeys[4] as string) : []
    keys.push({
        query: setFilters(dbClass, filters),
        sort: setSorts(dbClass, sorts)
    })
    const options = storeKeys[5] ? JSON.parse(storeKeys[5] as string) : {}
    keys.push(setOptions(dbClass, options))
    const references = storeKeys[6] ? JSON.parse(storeKeys[6] as string) : []
    keys.push(references)
    const backReferences = storeKeys[7] ? JSON.parse(storeKeys[7] as string) : []
    keys.push(backReferences)
    return keys
}
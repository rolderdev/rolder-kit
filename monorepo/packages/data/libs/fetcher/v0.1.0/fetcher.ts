import { nanoquery } from "@nanostores/query"
import { time } from "../../../../../utils/debug/log/v0.2.0/log"
import { getKuzzleFetchKeys } from "./keysFabric"
import getRItems from "../../../utils/setItems/v0.3.0/setItems"

export const [createFetcherStore, createMutatorStore] = nanoquery({
    fetcher: (...storeKeys) => window.R.libs.Kuzzle?.connect().then(() => {
        const dbClass = storeKeys[1] as string
        time(`${storeKeys[1]} fetch`)
        return window.R.libs.Kuzzle?.document.search(...getKuzzleFetchKeys(storeKeys)).then((kResponse: KResponse) => {
            time(`${dbClass} fetch`, true)
            const references = storeKeys[5] as string
            const backReferences = storeKeys[6] as string
            return getRItems(dbClass, storeKeys.join(''), kResponse.hits as KItem[], references, backReferences)
        })
    })
})
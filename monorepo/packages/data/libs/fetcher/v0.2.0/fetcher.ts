import { nanoquery } from "@nanostores/query"
import { time } from "../../../../../utils/debug/log/v0.2.0/log"
import { getKuzzleFetchKeys } from "./keysFabric"
import setItems from "../../../utils/setItems/v0.3.0/setItems"
import ErrorHandler from "../../../../mantine/libs/errorHandler/v0.2.0/ErrorHandler"
import mGetUsers from "../../mGetUsers/v0.2.0/mGetUsers"

export const [createFetcherStore, createMutatorStore] = nanoquery({
    fetcher: (...storeKeys) => window.R.libs.Kuzzle?.connect().then(() => {
        const dbClass = storeKeys[1] as string
        const noodlNodeId = storeKeys[2] as string
        time(`${dbClass} fetch`)
        return window.R.libs.Kuzzle?.document.search(...getKuzzleFetchKeys(storeKeys)).then((kResponse: KResponse) => {
            const references = storeKeys[6] as string
            const backReferences = storeKeys[7] as string
            const getUsers = storeKeys[8] as string

            let kItems = kResponse.hits
            if (getUsers && JSON.parse(getUsers)) {
                const userIds = kItems?.filter(i => i._source.user?.id).map(i => i._source.user?.id)
                if (userIds?.length) return mGetUsers(userIds).then((rUsers) => {
                    kItems = kItems?.map(kItem => {
                        const rUser = rUsers?.find(i => i.id === kItem._source.user?.id)
                        if (rUser) kItem._source.user = rUser
                        return kItem
                    })
                    time(`${dbClass} fetch`, true)
                    return setItems(dbClass, noodlNodeId, storeKeys.join(''), kItems as KItem[], references, backReferences)
                })
            } else {
                time(`${dbClass} fetch`, true)
                return setItems(dbClass, noodlNodeId, storeKeys.join(''), kItems as KItem[], references, backReferences)
            }
        }).catch((error) => {
            ErrorHandler('Системная ошибка!', `Fetcher error: ${error.message}`)
            console.error(error)
        })
    })
})
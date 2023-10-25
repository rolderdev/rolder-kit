import { time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/utils/errorHandler/v0.2.0/ErrorHandler"
import setItems from "../../../utils/setItems/v0.3.0/setItems"
import { dbClassVersion, dbVersion } from "../../../utils/getVersion/v0.3.0/getVersion"
import setSearchResults from "./setSearchResults"
import mGetUsers from "../../mGetUsers/v0.2.0/mGetUsers"

export default async function (searchProps: SearchProps, noodlNodeId: string, getUsers: boolean): Promise<SearchResults | void> {
    const { Kuzzle } = window.R.libs
    const { flush } = window.R.libs.just
    const { dbClass, searchString, searchFields, sorts, references, backReferences, useReferences } = searchProps

    let dbClassesV = [dbClassVersion(dbClass)]
    if (useReferences) {
        dbClassesV = dbClassesV.concat(references?.map(i => dbClassVersion(i)) || [])
        dbClassesV = dbClassesV.concat(backReferences?.map(i => dbClassVersion(i)) || [])
    }

    const query = {
        multi_match: {
            query: searchString,
            fuzziness: 1,
            fields: searchFields
        }
    }

    time(dbClassesV.join(', '))

    return Kuzzle.connect().then(() =>
        Kuzzle.query({
            controller: 'document',
            action: 'search',
            targets: [{ index: dbVersion(), collections: dbClassesV }],
            body: { query }
        }).then((kResponse: any) => {
            let rItems: RItem[] = []
            kResponse.result.hits.forEach((hit: any) => {
                const hitDbClass: string = hit.collection.split('_')[0]
                const rItem = setItems(hitDbClass, noodlNodeId, 'search', [hit as KItem], JSON.stringify(references), JSON.stringify(backReferences))?.[0]
                if (rItem) rItems.push(rItem)
            })

            if (getUsers) {
                const userIds = flush(rItems.filter(i => i.user?.id).map(i => i.user?.id))
                if (userIds?.length) return mGetUsers(userIds).then((rUsers) => {
                    rItems = rItems?.map(rItem => {
                        const rUser = rUsers?.find(i => i.id === rItem.user?.id)
                        if (rUser) rItem.user = rUser
                        return rItem
                    })
                    time(dbClassesV.join(', '), true)
                    return setSearchResults(dbClass, rItems, sorts, useReferences)
                })
                else {
                    time(dbClassesV.join(', '), true)
                    return setSearchResults(dbClass, rItems, sorts, useReferences)
                }
            } else {
                time(dbClassesV.join(', '), true)
                return setSearchResults(dbClass, rItems, sorts, useReferences)
            }
        }).catch((error) => {
            ErrorHandler('Системная ошибка!', `Kuzzle search ${dbClassesV.join(', ')}: ${error.message}`)
            console.error(error)
        })
    )
}
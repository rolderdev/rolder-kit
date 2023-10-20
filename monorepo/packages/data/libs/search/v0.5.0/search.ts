import { time } from "../../../../../utils/debug/log/v0.2.0/log"
import ErrorHandler from "../../../../mantine/libs/errorHandler/v0.2.0/ErrorHandler"
import setItems from "../../../utils/setItems/v0.3.0/setItems"
import { dbClassVersion, dbVersion } from "../../../utils/getVersion/v0.3.0/getVersion"
import setSearchResults from "./setSearchResults"

export default async function (searchProps: SearchProps, noodlNodeId: string): Promise<SearchResults | void> {
    const { Kuzzle } = window.R.libs
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
            time(dbClassesV.join(', '), true)

            const rItems: RItem[] = []
            kResponse.result.hits.forEach((hit: any) => {
                const hitDbClass: string = hit.collection.split('_')[0]
                const rItem = setItems(hitDbClass, noodlNodeId, 'search', [hit as KItem], JSON.stringify(references), JSON.stringify(backReferences))?.[0]
                if (rItem) rItems.push(rItem)
            })
            const searchResults = setSearchResults(dbClass, rItems, sorts, useReferences)

            return searchResults
        }).catch((error) => {
            ErrorHandler('Системная ошибка!', `Kuzzle search ${dbClassesV.join(', ')}: ${error.message}`)
            console.error(error)
        })
    )
}
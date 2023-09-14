import conLog from "../../../../../../utils/debug/conLog/v0.1.0/conLog"
import ErrorHandler from "../../../../../errorHandler/v0.1.0/ErrorHandler"
import { convertKSearch } from "../../../../1_transform/tools/convertK/v0.1.0/convertK"
import setRefs from "../../../../1_transform/tools/setRefs/v0.5.0/setRefs"
import { dbClassVersion, dbVersion } from "../../../tools/getVersion/v0.2.0/getVersion"
import setSearchResults from "../../../../1_transform/search/v0.1.0/setSearchResults"

export default async function (props: SearchProps): Promise<SearchNResults> {
    const { Kuzzle, Noodl } = window
    const { dbClass, searchString, searchFields, useReferences, sorts } = props

    let dbClassesV = [dbClassVersion(dbClass)]
    const dbClasses: DbClassesDef = eval(Noodl.getProjectSettings().dbClasses)[0]
    if (useReferences) dbClasses[dbClass]?.references?.map(i => dbClasses[i] && dbClassesV.push(dbClassVersion(i)))

    const query = {
        multi_match: {
            query: searchString,
            fuzziness: 1,
            fields: searchFields
        }
    }

    conLog(dbClassesV, 'time')

    return Kuzzle.connect().then(() =>
        Kuzzle.query(
            {
                controller: 'document',
                action: 'search',
                targets: [{ index: dbVersion(), collections: dbClassesV }],
                body: { query }
            })
            .then((response: { result: SearchKResponse }) => {
                conLog(dbClassesV, 'timeEnd')
                const searchResults = convertKSearch(response.result)
                const searchNResults = setSearchResults(dbClass, searchResults, sorts, useReferences)
                setRefs(dbClass)
                return searchNResults
            }).catch((error: { message: string }) =>
                ErrorHandler({ title: 'Системная ошибка!', message: 'Kuzzle search ' + dbClassesV.join(', ') + ': ' + error.message }))
    )
}
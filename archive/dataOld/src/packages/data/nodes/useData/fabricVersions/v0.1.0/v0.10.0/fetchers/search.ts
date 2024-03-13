import setItems from "../utils/setItems"
import setSearchResults from "../utils/setSearchResults"
import fetch from "./fetch"

export default async function (searchString: string, searchScheme: SearchScheme, mainDbClass: string): Promise<RItem[]> {
    const { map } = window.R.libs.just

    const queryKeys = Object.keys(searchScheme).map(dbClass => {
        const scheme = { ...searchScheme[dbClass], dbClass }
        const mathFilter = {
            multi_match: {
                query: searchString,
                fields: searchScheme[dbClass].fields,
                fuzziness: 1
            }
        }
        scheme.filters
            ? scheme.filters.and.push(mathFilter)
            : scheme.filters = mathFilter
        return scheme
    })

    let resultNItems: RItem[] = []
    await Promise.all(
        queryKeys.map(async qKey => {
            const rItems = await fetch({ queryKey: [qKey] })
            if (rItems) {
                let targetNodeId = ''
                map(window.Noodl.Object._models, (_, item: RItem) => { if (item.dbClass === qKey.dbClass) targetNodeId = item.noodlNodeId })
                if (targetNodeId) resultNItems = resultNItems.concat(setItems(rItems, qKey.dbClass, targetNodeId, qKey.refs, qKey.backRefs))
            }
        })
    )

    return setSearchResults(mainDbClass, Object.keys(searchScheme), resultNItems, searchScheme[mainDbClass].refs, searchScheme[mainDbClass].backRefs)
}
import fetch from "../fetchers/fetch"

export default function (queryContext: any) {
    const { unique } = window.R.libs.just
    const [useDataScheme, searchString] = queryContext.queryKey

    if (useDataScheme) {
        const dbClasses = Object.keys(useDataScheme)
        const queryKeys: QueryKey[] = []
        dbClasses.forEach(dbClass => {
            const queryKey: Partial<QueryKey> = { ...useDataScheme[dbClass], dbClass }
            if (searchString) queryKey.query?.and.push({
                multi_match: {
                    query: searchString,
                    fields: useDataScheme.searchFields,
                    fuzziness: 1
                }
            })
            queryKeys.push(queryKey as QueryKey)
        })

        const orders = unique(queryKeys.map((i: any) => i.order)).sort()
        const queryArrays = orders.map(order => {
            return queryKeys.filter((i: any) => i.order === order)
        })

        async function executeArrays() {
            let results: { [dbClass: string]: RItem[] | void } = {};
            for (const queryArray of queryArrays) {
                const arrayResults = await Promise.all(queryArray.map(query => fetch(query)))
                queryArray.forEach((query, idx) => results[query.dbClass] = arrayResults[idx])
            }
            return results
        }

        executeArrays()
    }
}
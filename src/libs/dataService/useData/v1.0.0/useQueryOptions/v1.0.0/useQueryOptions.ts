export default function getQueryOptions(queryKey: QueryKey) {
    const { dbClasses: dbClassesDef } = window.Rolder
    const { command, query, dbClasses } = queryKey
    let queryOptions: { enabled?: boolean, staleTime?: number, cacheTime?: number } = { enabled: true }

    switch (command) {
        case 'search': queryOptions.enabled = query?.multi_match?.query?.length > 0 ? true : false; break
    }
    if (command !== 'search' && dbClassesDef[dbClasses[0]].subscribe) {
        queryOptions.staleTime = Infinity
        queryOptions.cacheTime = Infinity
    } else queryOptions.staleTime = 0

    return queryOptions
}
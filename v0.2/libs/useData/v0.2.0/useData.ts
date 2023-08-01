import { useQuery } from "@tanstack/react-query"
import fetch from "../../kuzzle/v.0.1.0/fetch"
import get from "../../kuzzle/v.0.1.0/get"
import mGet from "../../kuzzle/v.0.1.0/mGet"
import search from "../../kuzzle/v.0.1.0/search"
import keys from "./keys"

function getQueryOptions({ queryKey: [{ command, dbClass, query }] }: { queryKey: { command: string, dbClass: string, query: any }[] }) {
    const { dbClasses } = window.Rolder
    let queryOptions: { enabled?: boolean, staleTime?: number, cacheTime?: number } = { enabled: true }

    switch (command) {
        case 'search': queryOptions.enabled = query?.multi_match?.query.length > 0 ? true : false; break
    }
    if (command !== 'search' && dbClasses[dbClass].subscribe) {
        queryOptions.staleTime = Infinity
        queryOptions.cacheTime = Infinity
    } else queryOptions.staleTime = 0

    return queryOptions
}

const useData: any = {
    fetch: (props: any) => {
        const queryKey: any = keys.fetch(props)
        const queryOptions = getQueryOptions({ queryKey })
        return useQuery({ queryKey, queryFn: fetch, ...queryOptions })
    },
    customFetch: (props: any) => {
        const queryKey: any = keys.customFetch(props)
        const queryOptions = getQueryOptions({ queryKey })
        return useQuery({ queryKey, queryFn: fetch, ...queryOptions })
    },
    get: (props: any) => {
        const queryKey: any = keys.get(props)
        const queryOptions = getQueryOptions({ queryKey })
        return useQuery({ queryKey, queryFn: get, ...queryOptions })
    },
    mGet: (props: any) => {
        const queryKey: any = keys.mGet(props)
        const queryOptions = getQueryOptions({ queryKey })
        return useQuery({ queryKey, queryFn: mGet, ...queryOptions })
    },
    search: (props: any) => {
        const queryKey: any = keys.search(props)
        const queryOptions = getQueryOptions({ queryKey })
        return useQuery({ queryKey, queryFn: search, ...queryOptions })
    },
    invalidate: (props: any) => {
        window.QueryClient.invalidateQueries(keys.dbClass(props.dbClass))
    },
}

export default useData
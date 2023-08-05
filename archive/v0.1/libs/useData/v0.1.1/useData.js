import { useQuery } from "@tanstack/react-query"
import fetch from "../../kuzzle/v0.1.0/fetch"
import get from "../../kuzzle/v0.1.0/get"
import mGet from "../../kuzzle/v0.1.0/mGet"
import search from "../../kuzzle/v0.1.0/search"
import keys from "./keys"

function getQueryOptions({ queryKey: [{ command, dbClass, query }] }) {
    const { classes } = Rolder
    let queryOptions = {}

    switch (command) {
        case 'search': queryOptions.enabled = query?.multi_match?.query.length > 0 ? true : false; break
    }
    if (command !== 'search' && classes[dbClass].subscribe) {
        queryOptions.staleTime = Infinity
        queryOptions.cacheTime = Infinity
    } else queryOptions.staleTime = 0

    return queryOptions
}

const useData = {
    fetch: (props) => {
        const queryKey = keys.fetch(props)
        const queryOptions = getQueryOptions({ queryKey })
        return useQuery({ queryKey, queryFn: fetch, ...queryOptions })
    },
    customFetch: (props) => {
        const queryKey = keys.customFetch(props)
        const queryOptions = getQueryOptions({ queryKey })
        return useQuery({ queryKey, queryFn: fetch, ...queryOptions })
    },
    get: (props) => {
        const queryKey = keys.get(props)
        const queryOptions = getQueryOptions({ queryKey })
        return useQuery({ queryKey, queryFn: get, ...queryOptions })
    },
    mGet: (props) => {
        const queryKey = keys.mGet(props)
        const queryOptions = getQueryOptions({ queryKey })
        return useQuery({ queryKey, queryFn: mGet, ...queryOptions })
    },
    search: (props) => {
        const queryKey = keys.search(props)
        const queryOptions = getQueryOptions({ queryKey })
        return useQuery({ queryKey, queryFn: search, ...queryOptions })
    },
    invalidate: (props) => {
        queryClient.invalidateQueries(keys.dbClass(props.dbClass))
    },
}

export default useData
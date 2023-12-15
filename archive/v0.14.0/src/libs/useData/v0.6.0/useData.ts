import { useQuery } from "@tanstack/react-query"
import useKeys from "../useKeys/v0.5.0/useKeys"
import getQueryOptions from "../useQueryOptions/v0.5.0/useQueryOptions"
import fetch from "../../kuzzle/fetch/v0.4.0/fetch"
import search from "../../kuzzle/search/v0.3.0/search"

const useData = {
    fetch: (props: FetchProps) => {
        const queryKey = useKeys.fetch(props)
        const queryOptions: any = getQueryOptions({ command: 'fetch', subscribe: props.subscribe })
        return useQuery<NoodlDbClass>({ queryKey, queryFn: fetch, ...queryOptions })
    },
    search: (props: SearchProps) => {
        const queryKey = useKeys.search(props)
        const queryOptions: any = getQueryOptions({ command: 'search', searchString: props.query.searchString })
        return useQuery({ queryKey, queryFn: search, ...queryOptions })
    },
    invalidate: (dbClass: string) => {
        window.QueryClient.invalidateQueries(useKeys.dbClass(dbClass))
    }
}

export default useData
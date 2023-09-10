import { useQuery } from "@tanstack/react-query"
import useKeys from "../useKeys/v0.5.0/useKeys"
import getQueryOptions from "../useQueryOptions/v0.4.0/useQueryOptions"
import search from "../../kuzzle/search/v0.3.0/search"


const useData = {
    search: (props: SearchProps) => {
        const queryKey = useKeys.search(props)
        const queryOptions = getQueryOptions(queryKey[0])
        return useQuery({ queryKey, queryFn: search, ...queryOptions })
    },
    invalidate: (props: { dbClasses: string[] }) => {
        window.QueryClient.invalidateQueries(useKeys.dbClasses(props.dbClasses))
    },
}

export default useData
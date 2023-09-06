import { useQuery } from "@tanstack/react-query"
import useKeys from "../../useKeys/v1.0.0/useKeys"
import getQueryOptions from "../../useQueryOptions/v1.0.0/useQueryOptions"
import search from "../../../../kuzzle/search/v1.0.0/search"

export default function (props: SearchProps) {
    const queryKey = useKeys.search(props)
    const queryOptions = getQueryOptions(queryKey[0])
    return useQuery({ queryKey, queryFn: search, ...queryOptions })
}
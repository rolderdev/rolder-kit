import { useQuery } from "@tanstack/react-query"
import fetch from "../../../2_back/get/fetch/v0.5.0/fetch"
import getQueryKey from "../../tools/getQueryKey/v0.6.0/getQueryKey"
import getQueryOptions from "../../tools/getQueryOptions/v0.6.0/getQueryOptions"

const getQuery = {
    fetch: (props: GetQuery) => {
        const queryKey = getQueryKey.fetch(props)
        const queryOptions: any = getQueryOptions({ command: 'fetch', subscribe: props.subscribe })
        return useQuery<QClass>({ queryKey, queryFn: fetch, ...queryOptions })
    }
}

export default getQuery
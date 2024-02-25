import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import directSetRefs from "./refs/directSetRefs"
import backwardSetRefs from "./refs/backwardSetRefs"
import { localDataCache, maxPage } from "../useData"
import { subscribe } from "./subscribe"
import { NoodlNode } from "@shared/node"
import { DataScheme, PagesSearchAfter } from "../types"
import { sendOutput, sendSignal } from "@shared/port-send"
import { dataCache, dataStates } from "@shared/data-context"
import { kuzzleFetch } from '@shared/kuzzle-fetch'

export default function (props:
    { noodlNode: NoodlNode, dataContextId: string, dataScheme: DataScheme, page: number, pagesSearchAfter: PagesSearchAfter[] }
) {
    const { noodlNode, dataContextId, dataScheme, page, pagesSearchAfter } = props
    const { dbClass, querySize } = dataScheme

    const { data, isFetching, isFetched } = useQuery({
        queryKey: [{ ...dataScheme, searchAfter: pagesSearchAfter.find(i => i.page === page)?.searchAfter }],
        queryFn: (queryContext: any) => kuzzleFetch(queryContext.queryKey[0])
    })

    sendOutput(noodlNode, 'fetching', isFetching)
    if (dataContextId) dataStates.setKey(`${dataContextId}.${dbClass}`, isFetching)

    const queryClient = useQueryClient()

    useEffect(() => {
        if (isFetched) {            
            if (dataContextId) {
                dataCache.setKey(`${dataContextId}.${dbClass}`, data?.items || [])
                let dataWithRefs = directSetRefs(dataContextId, dataScheme)
                sendOutput(noodlNode, 'items', dataWithRefs)
                backwardSetRefs(dataContextId, dataScheme)
            } else {
                localDataCache.setKey(noodlNode.id, data?.items || [])
                sendOutput(noodlNode, 'items', data?.items || [])
            }

            if (data?.total && querySize) maxPage.setKey(noodlNode.id, Math.ceil(data?.total / querySize))
            if (data?.aggregations) sendOutput(noodlNode, 'aggregations', data.aggregations)
            sendOutput(noodlNode, 'fetchedPage', page)
            sendOutput(noodlNode, 'fetchedItemsCount', data?.items?.length || 0)
            sendOutput(noodlNode, 'totalItemsCount', data?.total || 0)
            sendSignal(noodlNode, 'fetched')
            subscribe(noodlNode.id, dataScheme, queryClient)
        }
    }, [data])

    return null
}
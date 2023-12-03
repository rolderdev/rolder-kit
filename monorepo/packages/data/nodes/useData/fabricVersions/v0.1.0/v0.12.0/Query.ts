import { useQuery } from "@tanstack/react-query"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { useEffect } from "react"
import { dataCache, dataStates } from "../../../../dataContext/fabricVersions/v0.1.0/v0.1.0/DataContext"
import directSetRefs from "./refs/directSetRefs"
import backwardSetRefs from "./refs/backwardSetRefs"
import { localDataCache, maxPage } from "./UseData"
import fetch from "./fetchers/fetch"

export default function (props:
    { noodlNode: NoodlNode, dataContextId: string, dataScheme: DataScheme12, page: number, pagesSearchAfter: PagesSearchAfter[] }
) {
    const { noodlNode, dataContextId, dataScheme, page, pagesSearchAfter } = props
    const { dbClass, size } = dataScheme

    const { data, isFetching } = useQuery({
        queryKey: [{ ...dataScheme, searchAfter: pagesSearchAfter.find(i => i.page === page)?.searchAfter }],
        queryFn: fetch
    })

    sendOutput(noodlNode, 'fetching', isFetching)
    if (dataContextId) dataStates.setKey(`${dataContextId}.${dbClass}`, isFetching)

    useEffect(() => {
        if (!isFetching) {
            if (dataContextId) {
                dataCache.setKey(`${dataContextId}.${dbClass}`, data?.items || [])
                let dataWithRefs = directSetRefs(dataContextId, dataScheme)
                sendOutput(noodlNode, 'items', dataWithRefs)
                backwardSetRefs(dataContextId, dataScheme)
            } else {
                localDataCache.setKey(noodlNode.id, data?.items || [])
                sendOutput(noodlNode, 'items', data?.items || [])
            }

            if (data?.total && size) maxPage.setKey(noodlNode.id, Math.ceil(data?.total / size))
            if (data?.aggregations) sendOutput(noodlNode, 'aggregations', data.aggregations)
            sendOutput(noodlNode, 'fetchedPage', page)
            sendOutput(noodlNode, 'fetchedItemsCount', data?.items?.length || 0)
            sendOutput(noodlNode, 'totalItemsCount', data?.total || 0)
            sendSignal(noodlNode, 'fetched')
        }
    }, [data])

    return null
}
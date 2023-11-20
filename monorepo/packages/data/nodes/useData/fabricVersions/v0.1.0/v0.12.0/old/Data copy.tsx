import { useShallowEffect } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import { deepMap } from "nanostores"
import fetch from "../fetchers/fetch"
import directSetRefs from "../funcs/directSetRefs"
import backwardSetRefs from "../funcs/backwardSetRefs"
import { fetchState, searchCount } from "../UseData"
import { subscribe } from "../subscribe"
import { sendOutput, sendSignal } from "../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import sendUseDataOutput from "../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/sendUseDataOutput"

export const dataCache = deepMap<{ [noodlNodeId: string]: DataCache12 }>({})
export const searchCache = deepMap<{ [noodlNodeId: string]: DataCache12 }>({})

export default function (props: DataProps12) {
  const { isNil } = window.R.libs.lodash
  const { noodlNode, useDataScheme, dataScheme, searchString, enabled } = props

  subscribe(noodlNode.id, dataScheme)
  const { data, isFetched, isFetching } = useQuery({
    queryKey: [dataScheme],
    queryFn: fetch,
    enabled
  })

  if (dataScheme.sendStates) {
    const hasData = dataCache.get()[noodlNode.id]?.[dataScheme.dbClass]?.length
    sendOutput(noodlNode, 'pending', isFetching && !searchString && !hasData)
    sendOutput(noodlNode, 'fetching', isFetching)
  }

  useShallowEffect(() => {
    if (!searchString) {
      dataCache.setKey(`${noodlNode.id}.${dataScheme.dbClass}`, data || [])
      if (isFetched) {
        console.log('data state', fetchState.get()[noodlNode.id])
        if (!isNil(dataScheme.order)) fetchState.setKey(
          noodlNode.id,
          { order: dataScheme.order, count: fetchState.get()[noodlNode.id]?.count - 1 }
        )
        let dataWithRefs = directSetRefs(noodlNode.id, dataScheme)
        sendUseDataOutput(noodlNode, dataScheme.dbClass, dataWithRefs)
        sendSignal(noodlNode, 'fetched')
        dataCache.setKey(`${noodlNode.id}.${dataScheme.dbClass}`, dataWithRefs || [])
        backwardSetRefs(noodlNode, useDataScheme, dataScheme)
      }
    } else if (isFetched) {
      if (dataScheme.search?.fields) {
        let foudedRItems = dataCache.get()[noodlNode.id]?.[dataScheme.dbClass]?.filter(i => data?.map(i => i.id).includes(i.id))
        foudedRItems = foudedRItems.concat(searchCache.get()[noodlNode.id]?.[dataScheme.dbClass]
          ?.filter(i => !foudedRItems.map(i => i.id).includes(i.id)) || [])
        searchCache.setKey(`${noodlNode.id}.${dataScheme.dbClass}`, foudedRItems)
        searchCount.setKey(noodlNode.id, searchCount.get()[noodlNode.id] + 1)
      } else {
        searchCache.setKey(`${noodlNode.id}.${dataScheme.dbClass}`, [])
        searchCount.setKey(noodlNode.id, searchCount.get()[noodlNode.id] + 1)
      }
    }
  }, [data, searchString])

  return <></>
}
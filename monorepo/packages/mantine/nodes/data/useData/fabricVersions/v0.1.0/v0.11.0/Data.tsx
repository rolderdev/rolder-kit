import { useShallowEffect } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import { deepMap } from "nanostores"
import fetch from "./fetchers/fetch"
import directSetRefs from "./refs/directSetRefs"
import backwardSetRefs from "./refs/backwardSetRefs"
import sendUseDataOutput from "../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/sendUseDataOutput"
import { sendOutput, sendSignal } from "../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { searchCount } from "./UseData"
import { subscribe } from "./hooks/subscribe"

export const dataCache = deepMap<{ [noodleNodeId: string]: DataCache }>({})
export const searchCache = deepMap<{ [noodleNodeId: string]: DataCache }>({})

export default function (props: DataProps11) {
  const { noodlNode, useDataScheme, dataScheme, searchString } = props

  subscribe(dataScheme)
  const { data, isFetched, isFetching } = useQuery({
    queryKey: [dataScheme],
    queryFn: fetch
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
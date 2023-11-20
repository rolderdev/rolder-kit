import { useShallowEffect } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import fetch from "./fetchers/fetch"
import { useDecreaseOrderCount, useScheme, useSetRunStates } from "./hooks"
import { dataCache } from "./molecules"
import directSetRefs from "./funcs/directSetRefs"
import sendUseDataOutput from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/sendUseDataOutput"
import backwardSetRefs from "./funcs/backwardSetRefs"
import { subscribe } from "./subscribe"

export default function (props: QueryComp12) {
  const { isNil } = window.R.libs.lodash
  const { noodlNode, initialScheme, initialSchemes } = props

  const { enabled, scheme } = useScheme(noodlNode.id, initialScheme)
  const { data, isFetched, isFetching } = useQuery({
    enabled,
    queryKey: [scheme],
    queryFn: fetch,
  })

  const setRunStates = useSetRunStates()
  setRunStates(noodlNode, scheme.dbClass, isFetching)

  const decreaseOrderCount = useDecreaseOrderCount()
  subscribe(noodlNode.id, scheme, isFetched, enabled, decreaseOrderCount)
  useShallowEffect(() => {
    if (isFetched && !isFetching) {
      if (data) {
        console.log(scheme.dbClass, scheme.query?.and, data)
        dataCache.setKey(`${noodlNode.id}.${scheme.dbClass}`, data)
        let dataWithRefs = directSetRefs(noodlNode.id, scheme)
        sendUseDataOutput(noodlNode, scheme.dbClass, dataWithRefs)
        backwardSetRefs(noodlNode, initialSchemes, scheme)
      }
      if (!isNil(scheme.order)) decreaseOrderCount()
    }
  }, [data])

  return <></>
}
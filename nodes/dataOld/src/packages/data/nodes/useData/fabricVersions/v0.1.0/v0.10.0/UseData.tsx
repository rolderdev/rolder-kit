import { forwardRef, useEffect, useImperativeHandle } from "react"
import { subscribe } from "./hooks/subscribe";
import { useQuery } from "@tanstack/react-query";
import fetch from "./fetchers/fetch";
import setItems from "./utils/setItems";
import search from "./fetchers/search";
import { map } from "nanostores";
import { useDebouncedValue } from "@mantine/hooks";
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";

export const UseDataNoodlNodes: { [nodeId: string]: NoodlNode } = {}
export const useDataCache = map<{ [nodeId: string]: RItem[] }>({})

export default forwardRef(function (props: CompProps, ref) {
  const { noodlNode, dbClass, refs, backRefs, filters, sorts, options, getUsers, searchString, searchScheme } = props
  const queryKey: QueryKey = { dbClass, filters, sorts, options, refs, backRefs, getUsers }

  // interconnection
  useEffect(() => {
    UseDataNoodlNodes[noodlNode.id] = noodlNode
    return () => { delete UseDataNoodlNodes[noodlNode.id] }
  }, [])

  if (dbClass) subscribe(queryKey, noodlNode.id)

  const { data, isInitialLoading, isFetching, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: fetch,
    enabled: dbClass ? true : false
  })

  sendOutput(noodlNode, 'pending', isInitialLoading)
  sendOutput(noodlNode, 'fetching', !isInitialLoading && isFetching)

  // send data to output
  function sendData() {
    useDataCache.setKey(noodlNode.id, data || [])
    const nItems = setItems(data || [], dbClass, noodlNode.id, refs, backRefs)   
    sendOutput(noodlNode, 'items', nItems)
    sendSignal(noodlNode, 'fetched')
  }
  // refetch
  useImperativeHandle(ref, () => ({ refetch() { refetch() } }), [])
  // data
  useEffect(() => sendData(), [data])

  // search
  const [debouncedSearchString] = useDebouncedValue(searchString, 350)
  useEffect(() => {
    if (searchScheme && debouncedSearchString) {
      sendOutput(noodlNode, 'searching', true)
      search(debouncedSearchString, searchScheme, dbClass).then(nItems => {
        sendOutput(noodlNode, 'items', nItems)
        sendSignal(noodlNode, 'founded')
        sendOutput(noodlNode, 'searching', false)
      })
    }
  }, [debouncedSearchString])
  // reset search
  useEffect(() => { if (!searchString && debouncedSearchString) sendData() }, [searchString, debouncedSearchString])

  return <></>
})
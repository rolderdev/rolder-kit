import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { Box } from "@mantine/core";
import Data, { searchCache } from "./Data";
import { listenKeys, map } from "nanostores";
import getSearchResults from "./search/getSearchResults";
import sendUseDataOutput from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/sendUseDataOutput";
import { sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";

export const searchCount = map<{ [noodleNodeId: string]: number }>({})
const searchListeners = map<{ [noodleNodeId: string]: boolean }>({})

export default forwardRef(function (props: CompProps11, ref) {
  const { map } = window.R.libs.just
  const { noodlNode } = props

  const useDataScheme = () => {
    return props.useDataScheme?.map(dataScheme => {
      if (props.searchString && dataScheme.search?.fields) {
        const matchQuery = {
          multi_match: {
            query: props.searchString,
            fields: dataScheme.search.fields,
            fuzziness: 1
          }
        }
        dataScheme.query
          ? dataScheme.query.and
            ? dataScheme.query.and?.push(matchQuery)
            : dataScheme.query = { and: [dataScheme.query, matchQuery] }
          : dataScheme.query = matchQuery
      }
      return dataScheme
    })
  }

  searchCount.setKey(noodlNode.id, 0)
  searchCache.setKey(noodlNode.id, {})
  useEffect(() => {
    if (!searchListeners.get()[noodlNode.id]) {
      searchListeners.setKey(noodlNode.id, true)
      listenKeys(searchCount, [noodlNode.id], (value) => {
        if (useDataScheme().length === value[noodlNode.id]) {
          const searchResults = getSearchResults(noodlNode.id, useDataScheme())
          map(searchResults, (dbClass, rItems) => sendUseDataOutput(noodlNode, dbClass, rItems))
          sendSignal(noodlNode, 'founded')
        }
      })
    }
    return () => searchListeners.setKey(noodlNode.id, false)
  }, [])

  const localRef = useRef<any>(null)
  useImperativeHandle(ref, () => ({ refetch() { localRef.current?.refetch() } }), [])

  return <Box display='none'>
    {useDataScheme()?.length && useDataScheme().map(
      dataScheme => <Data {...{ noodlNode, useDataScheme: useDataScheme(), dataScheme, searchString: props.searchString }} ref={localRef} />
    )}
  </Box>
})
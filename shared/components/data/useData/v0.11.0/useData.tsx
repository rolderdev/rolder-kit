import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { Box } from "@mantine/core";
import Data, { searchCache } from "./src/data";
import { listenKeys, map } from "nanostores";
import getSearchResults from "./src/search/getSearchResults";
import sendUseDataOutput from "./src/sendUseDataOutput";
import { Props } from "./types";
import mapObject from 'just-map-object'
import { sendSignal } from '@shared/port-send'
import React from "react";

export const searchCount = map<{ [noodleNodeId: string]: number }>({})
const searchListeners = map<{ [noodleNodeId: string]: boolean }>({})

export default forwardRef(function (props: Props, ref) {
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
          mapObject(searchResults, (dbClass, rItems) => sendUseDataOutput(noodlNode, dbClass, rItems))
          //@ts-ignore
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
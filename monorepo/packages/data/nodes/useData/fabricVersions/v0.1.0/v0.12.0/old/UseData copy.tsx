import { forwardRef, useEffect, useState } from "react"
import { Box } from "@mantine/core";
import Data, { searchCache } from "../Query";
import { listenKeys, map } from "nanostores";
import getSearchResults from "../funcs/getSearchResults";
import sendUseDataOutput from "../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/sendUseDataOutput";
import { sendSignal } from "../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";
import filterBy from "./filterBy";
import { atom } from "jotai";

export const fetchState = map<{ [noodlNodeId: string]: { order: number, count: number } }>({})
const fetchStateListeners = map<{ [noodlNodeId: string]: boolean }>({})
export const searchCount = map<{ [noodlNodeId: string]: number }>({})
const searchListeners = map<{ [noodlNodeId: string]: boolean }>({})

export const dataStoreAtom = atom<{ [noodlNodeId: string]: {sheme: DataScheme12, data: DataCache12} }>

export default forwardRef(function (props: CompProps12) {
  const { map, unique, flush } = window.R.libs.just
  const { isNil } = window.R.libs.lodash
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
        dataScheme.query ? dataScheme.query?.and?.push(matchQuery) : dataScheme.query = matchQuery
      }
      return dataScheme
    })
  }

  const [order, setOrder] = useState(0)
  searchCount.setKey(noodlNode.id, 0)
  searchCache.setKey(noodlNode.id, {})
  useEffect(() => {
    if (props.useDataScheme) {
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

      const orders = unique(flush(props.useDataScheme.map(i => i.order))).sort()
      if (orders.length) {
        const orderLengthes = orders.map(order => props.useDataScheme.filter(i => i.order === order).length)
        fetchState.setKey(`${noodlNode.id}`, { order: orders[0], count: orderLengthes[0] })
        setOrder(orders[0])
        console.log(orders, orderLengthes)

        if (!fetchStateListeners.get()[noodlNode.id]) {
          fetchStateListeners.setKey(noodlNode.id, true)
          listenKeys(fetchState, [noodlNode.id], (value) => {
            console.log(value[noodlNode.id])
            if (value[noodlNode.id].count === 0) {
              const nextOrder = fetchState.get()[noodlNode.id]?.order + 1
              if (orders[nextOrder]) {
                console.log('nextOrder', orders[nextOrder], orderLengthes[nextOrder])
                fetchState.setKey(`${noodlNode.id}`, { order: nextOrder, count: orderLengthes[nextOrder] })
                console.log('fetchState', fetchState.get()[noodlNode.id])
                setOrder(nextOrder)
              } else {
                fetchState.setKey(`${noodlNode.id}`, { order: orders[0], count: orderLengthes[0] })
                setOrder(orders[0])
              }
            }
          })
        }
      }
    }
  }, [props.useDataScheme])

  // disable listeners on unMount
  useEffect(() => {
    return () => {
      searchListeners.setKey(noodlNode.id, false)
      fetchStateListeners.setKey(noodlNode.id, false)
    }
  })

  console.log(order)

  return <Box display='none'>
    {props.useDataScheme?.length && useDataScheme().map(
      dataScheme => {
        const enabled = !isNil(dataScheme.order) && dataScheme.order === order ? true : false
        return < Data {...{
          noodlNode,
          useDataScheme: useDataScheme(),
          dataScheme: enabled && dataScheme.filterBy ? filterBy(noodlNode.id, dataScheme) : dataScheme,
          searchString: props.searchString,
          enabled
        }} />
      }
    )}
  </Box>
})
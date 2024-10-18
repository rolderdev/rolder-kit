import { dataCache, dataStates } from '@packages/data-context'
import { kuzzleFetch } from '@packages/kuzzle-fetch'
import { subscribe } from '@packages/kuzzle-subscribe'
import type { NoodlNode } from '@packages/node'
import { sendOutput, sendSignal } from '@packages/port-send'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { DataScheme, PagesSearchAfter } from '../types'
import { localDataCache, maxPage } from '../useData'
import backwardSetRefs from './refs/backwardSetRefs'
import directSetRefs from './refs/directSetRefs'

export default function (props: {
	noodlNode: NoodlNode
	dataContextId: string
	dataScheme: DataScheme
	page: number
	pagesSearchAfter: PagesSearchAfter[]
}) {
	const { noodlNode, dataContextId, dataScheme, page, pagesSearchAfter } = props
	const { dbClass, querySize } = dataScheme

	const { data, isFetching, isFetched } = useQuery({
		queryKey: [{ ...dataScheme, searchAfter: pagesSearchAfter.find((i) => i.page === page)?.searchAfter }],
		queryFn: (queryContext: any) => kuzzleFetch(queryContext.queryKey[0]),
	})

	sendOutput(noodlNode, 'fetching', isFetching)
	if (dataContextId) dataStates.setKey(`${dataContextId}.${dbClass}`, isFetching)

	useEffect(() => {
		if (isFetched) {
			if (dataContextId) {
				dataCache.setKey(`${dataContextId}.${dbClass}`, data?.items || [])
				const dataWithRefs = directSetRefs(dataContextId, dataScheme)
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
			subscribe(noodlNode.id, dataScheme)
		}
	}, [data])

	return null
}

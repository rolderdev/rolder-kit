import { useShallowEffect } from '@mantine/hooks'
import { sendOutput, sendSignal } from '@packages/port-send'
import { useQuery } from '@tanstack/react-query'
import { deepMap } from 'nanostores'
import { forwardRef, useImperativeHandle } from 'react'
import type { DataCache, DataProps } from '../types'
import { searchCount } from '../useData'
import fetch from './fetchers/fetch'
import { subscribe } from './hooks/subscribe'
import backwardSetRefs from './refs/backwardSetRefs'
import directSetRefs from './refs/directSetRefs'
import sendUseDataOutput from './sendUseDataOutput'

export const dataCache = deepMap<{ [noodleNodeId: string]: DataCache }>({})
export const searchCache = deepMap<{ [noodleNodeId: string]: DataCache }>({})

export default forwardRef((props: DataProps, ref) => {
	const { noodlNode, useDataScheme, dataScheme, searchString } = props

	subscribe(dataScheme)
	const { data, isFetched, isFetching, refetch } = useQuery({
		queryKey: [dataScheme],
		queryFn: fetch,
	})

	useImperativeHandle(
		ref,
		() => ({
			refetch() {
				refetch()
			},
		}),
		[]
	)

	if (dataScheme.sendStates) {
		const hasData = dataCache.get()[noodlNode.id]?.[dataScheme.dbClass]?.length
		//@ts-ignore
		sendOutput(noodlNode, 'pending', isFetching && !searchString && !hasData)
		sendOutput(noodlNode, 'fetching', isFetching)
	}

	useShallowEffect(() => {
		if (!searchString) {
			dataCache.setKey(`${noodlNode.id}.${dataScheme.dbClass}`, data || [])
			if (isFetched) {
				const dataWithRefs = directSetRefs(noodlNode.id, dataScheme)
				sendUseDataOutput(noodlNode, dataScheme.dbClass, dataWithRefs)
				//@ts-ignore
				sendSignal(noodlNode, 'fetched')
				dataCache.setKey(`${noodlNode.id}.${dataScheme.dbClass}`, dataWithRefs || [])
				backwardSetRefs(noodlNode, useDataScheme, dataScheme)
			}
		} else if (!isFetching) {
			if (dataScheme.search?.fields) {
				let foudedRItems = dataCache
					.get()
					[noodlNode.id]?.[dataScheme.dbClass]?.filter((i) => data?.map((i) => i.id).includes(i.id))
				foudedRItems = foudedRItems.concat(
					searchCache.get()[noodlNode.id]?.[dataScheme.dbClass]?.filter((i) => !foudedRItems.map((i) => i.id).includes(i.id)) ||
						[]
				)
				searchCache.setKey(`${noodlNode.id}.${dataScheme.dbClass}`, foudedRItems)
				searchCount.setKey(noodlNode.id, searchCount.get()[noodlNode.id] + 1)
			} else {
				searchCache.setKey(`${noodlNode.id}.${dataScheme.dbClass}`, [])
				searchCount.setKey(noodlNode.id, searchCount.get()[noodlNode.id] + 1)
			}
		}
	}, [data, searchString])

	return null
})

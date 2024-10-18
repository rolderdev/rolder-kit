import { DataContextMolecule, dataCache, dataNodes, dataSchemes } from '@packages/data-context'
import getValue from '@packages/get-value'
import { useMolecule } from 'bunshi/react'
import clone from 'just-clone'
import isObjectEmpty from 'just-is-empty'
import last from 'just-last'
import { deepMap } from 'nanostores'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import React from 'react'
import type { Item } from 'types'
import { unSubscribe } from './src/subscribe'
import type { PagesSearchAfter, Props, Sorts } from './types'

function getSearchAfter(items?: Item[], sorts?: Sorts) {
	if (items?.length) {
		const searchAfter = []
		sorts?.forEach((i) => searchAfter.push(getValue(last(items), Object.keys(i)[0])))
		searchAfter.push(last(items).id)
		return searchAfter
	} else return undefined
}

function getDataScheme(props: Props) {
	const { dbClass, filters, sorts, querySize, refs, backRefs, getUsers, searchFields, searchString, aggQuery } = props

	const matchQuery = {
		multi_match: {
			query: searchString,
			fields: searchFields,
			fuzziness: 1,
		},
	}

	let fs = clone(filters || {})
	if (searchFields?.length && searchString?.length)
		!isObjectEmpty(fs) ? (fs.and ? fs.and?.push(matchQuery) : (fs = { and: [filters, matchQuery] })) : (fs = matchQuery)

	return { dbClass, filters: fs, sorts, querySize, refs, backRefs, getUsers, aggQuery }
}

export const localDataCache = deepMap<{ [noodlNodeId: string]: Item[] }>({})
export const maxPage = deepMap<{ [noodlNodeId: string]: number }>({})
export const hack = deepMap<{ [noodlNodeId: string]: boolean }>({})

import Query from './src/query'

export default forwardRef((props: Props, ref) => {
	const { noodlNode, dbClass, sorts } = props
	const dataContextId = useMolecule(DataContextMolecule)

	useEffect(() => {
		if (dataContextId) {
			dataNodes.setKey(`${dataContextId}.${dbClass}`, noodlNode as any)
			dataSchemes.setKey(`${dataContextId}.${dbClass}`, getDataScheme(props))
			if (page !== 1) setPage(1)
		}
	}, [props])

	const [page, setPage] = useState(1)
	const [pagesSearchAfter, setPagesSearchAfter] = useState<PagesSearchAfter[]>([{ page: 1 }])

	useImperativeHandle(
		ref,
		() => ({
			nextFetch() {
				if (!hack.get()[noodlNode.id]) hack.setKey(noodlNode.id, true)
				else {
					setPage((old) => {
						const newPage = old + 1
						if (newPage <= maxPage.get()[noodlNode.id]) {
							let items = []
							if (dataContextId) items = dataCache.get()[dataContextId]?.[dbClass]
							else items = localDataCache.get()[noodlNode.id]
							if (items?.length) {
								const searchAfter = getSearchAfter(items, sorts)
								setPagesSearchAfter((old) => {
									old.push({ page: newPage, searchAfter })
									return old
								})
							}
						}
						return newPage <= maxPage.get()[noodlNode.id] ? newPage : maxPage.get()[noodlNode.id]
					})
					hack.setKey(noodlNode.id, false)
				}
			},
			previousFetch() {
				if (!hack.get()[noodlNode.id]) hack.setKey(noodlNode.id, true)
				else {
					setPage((old) => {
						const newPage = old - 1
						return newPage > 0 ? newPage : 1
					})
					hack.setKey(noodlNode.id, false)
				}
			},
		}),
		[hack, page, setPage, dataContextId, setPagesSearchAfter, noodlNode, getSearchAfter, maxPage]
	)

	useEffect(() => {
		return () => {
			localDataCache.setKey(noodlNode.id, [])
			maxPage.setKey(noodlNode.id, 0)
			hack.setKey(noodlNode.id, false)
			unSubscribe(noodlNode.id, dbClass)
		}
	}, [])

	return <Query {...{ noodlNode, dataContextId, dataScheme: getDataScheme(props), page, pagesSearchAfter }} />
})

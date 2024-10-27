import { dbClassVersion } from '@packages/get-dbclass-version'
import getValue from '@packages/get-value'
import isEmpty from '@packages/is-empty'
import { subscribe } from '@packages/kuzzle-subscribe'
import { sendOutput, sendOutputs, sendSignal } from '@packages/port-send'
import { onlineManager, useQuery } from '@tanstack/react-query'
import deepEqual from 'fast-deep-equal'
import clone from 'just-clone'
import last from 'just-last'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import React from 'react'
import type { Item } from 'types'
import queryFn from './src/queryFn'
import type { FetchScheme, PagesSearchAfter, Props, Sorts } from './types'

function getScheme(fetchScheme: FetchScheme, paginationScheme?: FetchScheme[number], searchAfter?: string[]) {
	let hasErrors = false
	const resultScheme: FetchScheme = clone(fetchScheme)
	resultScheme.forEach((dbClassScheme) => {
		if (paginationScheme && paginationScheme.dbClass === dbClassScheme.dbClass) dbClassScheme.searchAfter = searchAfter
		const dbClass = dbClassVersion(dbClassScheme.dbClass)
		if (dbClass) dbClassScheme.dbClass = dbClass
		else hasErrors = true
	})

	return hasErrors ? false : resultScheme
}

function getSearchAfter(items?: Item[], sorts?: Sorts) {
	if (items?.length) {
		const searchAfter = []
		sorts?.forEach((i) => searchAfter.push(getValue(last(items), Object.keys(i)[0])))
		searchAfter.push(last(items).id)
		return searchAfter
	} else return undefined
}

export default forwardRef((props: Props, ref) => {
	const { dbName } = R.env
	if (!dbName) {
		R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
		log.error('No dbName', R.env)
		return null
	}

	const [page, setPage] = useState(1)
	const [maxPage, setMaxPage] = useState(1)
	const [pagesSearchAfter, setPagesSearchAfter] = useState<PagesSearchAfter[]>([{ page: 1 }])
	const paginationScheme = props.fetchScheme?.find((i) => i.dbClass === props.paginationDbClass)

	const [lastPaginationScheme, setLastPaginationScheme] = useState<FetchScheme[number]>()
	const [lastSearchString, setLastSearchString] = useState<string | undefined>()
	const fetchScheme = getScheme(props.fetchScheme, paginationScheme, pagesSearchAfter.find((i) => i.page === page)?.searchAfter)
	if (!fetchScheme) return null
	useEffect(() => {
		if (
			(props.paginationEnabled && !deepEqual(lastPaginationScheme, paginationScheme)) ||
			lastSearchString !== props.searchString
		) {
			setLastPaginationScheme(paginationScheme)
			setLastSearchString(props.searchString)
			setPagesSearchAfter([{ page: 1 }])
			setPage(1)
		}
	}, [paginationScheme, props.searchString])

	const { data, isFetching, refetch } = useQuery({
		queryKey: [fetchScheme, props.searchString, page],
		queryFn: () => queryFn({ fetchScheme, props }),
		keepPreviousData: paginationScheme ? true : false,
	})

	useEffect(() => {
		if (props.searchEnabled && !props.searchString) refetch()
	}, [props.searchString])

	useEffect(() => {
		if (isFetching) sendOutput(props.noodlNode, 'fetching', true)
	}, [isFetching])

	useEffect(() => {
		if (data && !isFetching) {
			const ouputs: any = Object.keys(data).flatMap((dbClass) => [
				{ portName: `${dbClass}Items`, value: data[dbClass].items },
				{ portName: `${dbClass}Fetched`, value: data[dbClass].fetched },
				{ portName: `${dbClass}Total`, value: data[dbClass].total },
				{ portName: `${dbClass}Aggregations`, value: data[dbClass].aggregations },
			])
			ouputs.push({ portName: 'data', value: data })
			ouputs.push({ portName: 'fetching', value: false })

			if (paginationScheme) {
				ouputs.push({ portName: 'fetchedPage', value: page })
				const total = (paginationScheme.dbClass && data?.[paginationScheme.dbClass]?.total) || 0
				let size = paginationScheme.size
				if (isEmpty(paginationScheme.size)) size = 10
				if (total && size) setMaxPage(Math.ceil(total / size))
			}

			sendOutputs(props.noodlNode, ouputs)
			sendSignal(props.noodlNode, 'fetched')
		}
	}, [data, isFetching])

	useEffect(() => {
		for (const fs of fetchScheme) {
			if (fs.dbClass && onlineManager.isOnline()) subscribe(fs.dbClass)
		}
	}, [fetchScheme?.map((i) => i.dbClass)])

	useImperativeHandle(
		ref,
		() => ({
			nextFetch() {
				if (paginationScheme) {
					setPage((old) => {
						const newPage = old + 1
						if (props.paginationDbClass && newPage <= maxPage) {
							const items = data?.[props.paginationDbClass]?.items
							if (items?.length) {
								const searchAfter = getSearchAfter(items, paginationScheme.sorts)
								setPagesSearchAfter((old) => {
									old.push({ page: newPage, searchAfter })
									return old
								})
							}
						}
						return newPage <= maxPage ? newPage : maxPage
					})
				}
			},
			previousFetch() {
				if (paginationScheme) {
					setPage((old) => {
						const newPage = old - 1
						return newPage > 0 ? newPage : 1
					})
				}
			},
			refetch() {
				refetch()
			},
		}),
		[page, maxPage, paginationScheme, data]
	)

	return <div style={{ display: 'none' }} />
})

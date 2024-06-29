import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { FetchScheme, PagesSearchAfter, Props, Sorts } from './types';
import { onlineManager, useQuery } from '@tanstack/react-query';
import clone from 'just-clone';
import last from 'just-last'
import { sendOutput, sendOutputs, sendSignal } from '@packages/port-send';
import { subscribe } from '@packages/kuzzle-subscribe';
import React from 'react';
import type { Item } from 'types';
import getValue from '@packages/get-value';
import queryFn from './src/queryFn';
import deepEqual from 'fast-deep-equal'
import isEmpty from '@packages/is-empty'

function schemeValid(scheme: FetchScheme[number]): boolean {
  if (!scheme.dbClass) {
    R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbClass at scheme: ${JSON.stringify(scheme)}`)
    log.error('`No dbClass at scheme', scheme)
    return false
  }

  if (scheme.hierarchy) {
    if (!scheme.hierarchy.type) {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `No hierarchy type at scheme: ${JSON.stringify(scheme)}`)
      log.error('`No hierarchy type at scheme', scheme)
      return false
    }

    if (!scheme.hierarchy.scheme) {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `No hierarchy scheme at scheme: ${JSON.stringify(scheme)}`)
      log.error('`No hierarchy scheme at scheme', scheme)
      return false
    } else if (!scheme.hierarchy.scheme.dbClass) {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbClass at hierarchy scheme: ${JSON.stringify(scheme.hierarchy.scheme)}`)
      log.error('`No dbClass at hierarchy scheme', scheme.hierarchy.scheme)
      return false
    }
  }

  return true
}

function getScheme(fetchScheme: FetchScheme, paginationScheme?: FetchScheme[number], searchAfter?: string[]) {
  let hasErrors = false
  let resultScheme: FetchScheme = clone(fetchScheme)
  resultScheme.forEach(dbClassScheme => {
    if (paginationScheme && paginationScheme.dbClass === dbClassScheme.dbClass) dbClassScheme.searchAfter = searchAfter
    hasErrors = !schemeValid(dbClassScheme)
  })

  return hasErrors ? false : resultScheme
}

function getSearchAfter(items?: Item[], sorts?: Sorts) {
  if (items?.length) {
    let searchAfter = []
    sorts?.forEach(i => searchAfter.push(getValue(last(items), Object.keys(i)[0])))
    searchAfter.push(last(items).id)
    return searchAfter
  } else return undefined
}

export default forwardRef(function (props: Props, ref) {
  const { noodlNode } = props

  const { dbName } = R.env
  if (!dbName) {
    R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
    log.error('No dbName', R.env)
    return null
  }

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [pagesSearchAfter, setPagesSearchAfter] = useState<PagesSearchAfter[]>([{ page: 1 }])
  const paginationScheme = props.fetchScheme?.find(i => i.dbClass === props.paginationDbClass)

  const [lastPaginationScheme, setLastPaginationScheme] = useState<FetchScheme[number]>()
  const [lastSearchString, setLastSearchString] = useState<string | undefined>()
  const fetchScheme = getScheme(props.fetchScheme, paginationScheme, pagesSearchAfter.find(i => i.page === page)?.searchAfter)
  if (!fetchScheme) {
    sendOutputs(noodlNode, [{ portName: 'error', value: true }, { portName: 'fetching', value: false }])
    return null
  }

  useEffect(() => {
    if (props.paginationEnabled && !deepEqual(lastPaginationScheme, paginationScheme) || lastSearchString !== props.searchString) {
      setLastPaginationScheme(paginationScheme)
      setLastSearchString(props.searchString)
      setPagesSearchAfter([{ page: 1 }])
      setPage(1)
    }
  }, [paginationScheme, props.searchString])

  const { data, isFetching, refetch, isError } = useQuery({
    queryKey: [fetchScheme, props.searchString, page],
    queryFn: () => queryFn({ fetchScheme, props }),
    keepPreviousData: paginationScheme ? true : false
  })

  useEffect(() => {
    if (props.searchEnabled && !props.searchString) refetch()
  }, [props.searchString])

  useEffect(() => {
    if (isFetching && !isError) sendOutput(noodlNode, 'fetching', true)
    if (isError) sendOutputs(noodlNode, [{ portName: 'error', value: true }, { portName: 'fetching', value: false }])
  }, [isFetching, isError])

  useEffect(() => {
    if (data?.error) {
      sendOutputs(noodlNode, [{ portName: 'error', value: true }, { portName: 'fetching', value: false }])
      return
    }
    if (data && !isFetching) {
      let ouputs: any = Object.keys(data).map(dbClass => ([
        { portName: `${dbClass}Items`, value: data[dbClass].items },
        { portName: `${dbClass}Fetched`, value: data[dbClass].fetched },
        { portName: `${dbClass}Total`, value: data[dbClass].total },
        { portName: `${dbClass}Aggregations`, value: data[dbClass].aggregations },
      ])).flat()
      ouputs.push({ portName: 'data', value: data })
      ouputs.push({ portName: 'fetching', value: false })
      ouputs.push({ portName: 'error', value: false })

      if (paginationScheme) {
        ouputs.push({ portName: 'fetchedPage', value: page })
        const total = paginationScheme.dbClass && data?.[paginationScheme.dbClass]?.total || 0
        let size = paginationScheme.size
        if (isEmpty(paginationScheme.size)) size = 10
        if (total && size) setMaxPage(Math.ceil(total / size))
      }

      sendOutputs(noodlNode, ouputs)
      sendSignal(noodlNode, 'fetched')
    }
  }, [data, isFetching])

  useEffect(() => {
    for (const fs of fetchScheme) {
      if (fs.dbClass && onlineManager.isOnline()) subscribe(fs.dbClass)
    }
  }, [fetchScheme?.map(i => i.dbClass)])

  useImperativeHandle(ref, () => ({
    nextFetch() {
      if (paginationScheme) {
        setPage(old => {
          const newPage = old + 1
          if (props.paginationDbClass && newPage <= maxPage) {
            let items = data?.[props.paginationDbClass]?.items
            if (items?.length) {
              const searchAfter = getSearchAfter(items, paginationScheme.sorts)
              setPagesSearchAfter(old => {
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
        setPage(old => {
          const newPage = old - 1
          return newPage > 0 ? newPage : 1
        })
      }
    },
    refetch() { refetch() }
  }), [page, maxPage, paginationScheme, data])

  return <div style={{ display: 'none' }} />
})

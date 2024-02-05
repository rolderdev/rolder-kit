import { forwardRef, useEffect } from 'react';
import { Data, FetchScheme, Props } from './types';
import { useQuery } from '@tanstack/react-query';
import { getKuzzle } from '../../../utils/getKuzzle/v0.1.0/getKuzzle';
import { dbClassVersion } from '../../../utils/getDbClassVersion/v0.6.0/getDbClassVersion';
import clone from 'just-clone';
import { sendOutput, sendSignal } from '@shared/port-send';
import { subscribe, unSubscribe } from '@shared/kuzzle-subscribe';
import React from 'react';

function getScheme(fetchScheme: FetchScheme) {
  let hasErrors = false
  let resultScheme: FetchScheme = clone(fetchScheme)
  resultScheme.forEach(dbClassScheme => {
    const dbClass = dbClassVersion(dbClassScheme.dbClass)
    if (dbClass) dbClassScheme.dbClass = dbClass
    else hasErrors = true
  })

  return hasErrors ? false : resultScheme
}

export default forwardRef(function (props: Props) {
  const K = getKuzzle()
  if (!K) { return null }
  const { dbName } = R.env
  if (!dbName) {
    R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
    log.error('No dbName', R.env)
    return null
  }

  const fetchScheme = getScheme(props.fetchScheme)
  if (!fetchScheme) { return null }

  const { data, isFetching, isFetched, refetch } = useQuery({
    queryKey: [fetchScheme, props.searchString],
    queryFn: async (q) => {
      const startTime = log.start()
      let response = {} as { result: Data }

      if (q.queryKey[1]) {
        if (props.searchEnabled && props.searchScheme) {
          const searchScheme = getScheme(props.searchScheme)
          if (searchScheme) {
            response = await K.query({ controller: 'rolder', action: 'search', dbName, searchString: q.queryKey[1], searchScheme })
            log.info(`UseData search: ${searchScheme.map(i => i.dbClass).join(', ')}`, response.result)
            log.end(`UseData search: ${searchScheme.map(i => i.dbClass).join(', ')}`, startTime)
          } else log.error(`UseData search: no Search scheme`, props)
        } else log.error(`UseData search: no Search scheme`, props)
      } else {
        response = await K.query({ controller: 'rolder', action: 'fetch', dbName, fetchScheme })
        log.info(`UseData fetch: ${fetchScheme.map(i => i.dbClass).join(', ')}`, response.result)
        log.end(`UseData fetch: ${fetchScheme.map(i => i.dbClass).join(', ')}`, startTime)
      }

      const dataEntries = Object.entries(response.result)
      if (dataEntries.some(i => i[1].error)) {
        dataEntries.forEach(entry => {
          if (entry[1]?.error) {
            R.libs.mantine?.MantineError('Системная ошибка!', `UseData error at "${entry[0]}": ${entry[1]?.error}`)
            log.error(`UseData error at "${entry[0]}": ${entry[1]?.error}`)
          }
        })
        return {}
      } else return response.result
    },
  })

  useEffect(() => {
    if (!props.searchString) refetch()
  }, [props.searchString])

  sendOutput(props.noodlNode, 'fetching', isFetching)

  useEffect(() => {
    if (isFetched) {
      if (data) {
        Object.keys(data).map(dbClass => {
          //@ts-ignore
          sendOutput(props.noodlNode, `${dbClass}Items`, data[dbClass].items)
          //@ts-ignore
          sendOutput(props.noodlNode, `${dbClass}Fetched`, data[dbClass].fetched)
          //@ts-ignore
          sendOutput(props.noodlNode, `${dbClass}Total`, data[dbClass].total)
          //@ts-ignore
          sendOutput(props.noodlNode, `${dbClass}Aggregations`, data[dbClass].aggregations)
        })
        //@ts-ignore
        sendOutput(props.noodlNode, `data`, data)
        sendSignal(props.noodlNode, 'fetched')
      }
    }
  }, [data])

  useEffect(() => {
    subscribe(props.noodlNode.id, fetchScheme)
    return () => {
      unSubscribe(props.noodlNode.id, fetchScheme)
    }
  }, [])

  return <div style={{ display: 'none' }} />
})
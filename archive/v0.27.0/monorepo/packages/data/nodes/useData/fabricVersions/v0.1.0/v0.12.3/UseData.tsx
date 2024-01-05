import { Suspense, forwardRef, lazy, useEffect, useImperativeHandle, useState } from 'react';
import { DataContextMolecule, dataCache, dataNodes, dataSchemes } from '../../../../dataContext/fabricVersions/v0.1.0/v0.1.0/DataContext';
import { useMolecule } from 'bunshi/react';
import { deepMap } from 'nanostores';
import { unSubscribe } from './subscribe';

function getSearchAfter(items?: RItem[], sorts?: Sorts) {
  const { last } = window.R.libs.just
  const { getValue } = window.R.utils

  if (items?.length) {
    let searchAfter = []
    sorts?.forEach(i => searchAfter.push(getValue.v8(last(items), Object.keys(i)[0])))
    searchAfter.push(last(items).id)
    return searchAfter
  } else return undefined
}

function getDataScheme(props: CompProps123) {
  const { clone, isEmpty } = window.R.libs.just
  const { dbClass2: dbClass, filters, sorts, querySize, refs, backRefs, getUsers, searchFields, searchString, aggQuery } = props

  const matchQuery = {
    multi_match: {
      query: searchString,
      fields: searchFields,
      fuzziness: 1
    }
  }

  let fs = clone(filters || {})
  if (searchFields?.length && searchString?.length) !isEmpty(fs)
    ? fs.and
      ? fs.and?.push(matchQuery)
      : fs = { and: [filters, matchQuery] }
    : fs = matchQuery

  return { dbClass, filters: fs, sorts, size: querySize, refs, backRefs, getUsers, aggQuery }
}

export const localDataCache = deepMap<{ [noodlNodeId: string]: RItem[] }>({})
export const maxPage = deepMap<{ [noodlNodeId: string]: number }>({})
export const hack = deepMap<{ [noodlNodeId: string]: boolean }>({})

const Query = lazy(() => import("./Query"))

export default forwardRef(function (props: CompProps123, ref) {
  const { noodlNode, dbClass2: dbClass, sorts } = props
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

  useImperativeHandle(ref, () => ({
    nextFetch() {
      if (!hack.get()[noodlNode.id]) hack.setKey(noodlNode.id, true)
      else {
        setPage(old => {
          const newPage = old + 1
          if (newPage <= maxPage.get()[noodlNode.id]) {
            let items = []
            if (dataContextId) items = dataCache.get()[dataContextId]?.[dbClass]
            else items = localDataCache.get()[noodlNode.id]
            if (items?.length) {
              const searchAfter = getSearchAfter(items, sorts)
              setPagesSearchAfter(old => {
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
        setPage(old => {
          const newPage = old - 1
          return newPage > 0 ? newPage : 1
        })
        hack.setKey(noodlNode.id, false)
      }
    }
  }), [hack, page, setPage, dataContextId, setPagesSearchAfter, noodlNode, getSearchAfter, maxPage])

  useEffect(() => {
    return () => {
      localDataCache.setKey(noodlNode.id, [])
      maxPage.setKey(noodlNode.id, 0)
      hack.setKey(noodlNode.id, false)
      unSubscribe(noodlNode.id, dbClass)
    }
  }, [])

  return <Suspense fallback={null}>
    <Query {...{ noodlNode, dataContextId, dataScheme: getDataScheme(props), page, pagesSearchAfter }} />
  </Suspense>
})
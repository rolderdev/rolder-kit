import { EmbeddedSDK, KuzzleRequest } from "kuzzle"
import fetch from '../funcs/fetchers/fetch'
import unique from "just-unique"
import prepareScheme from "../funcs/schemes/prepareFetchScheme"
import { BaseFetchScheme, Data, DbClasses, HierarchyFunction } from "../types"
import applyFilters from '../funcs/filters/applyFilters'
import directSetRefs from "../funcs/refs/directSetRefs"

async function fetchHierarchy(
  dbName: string,
  sdk: EmbeddedSDK,
  dbClasses: DbClasses,
  level: number,
  parentDbClass: string,
  parentData: Data,
  hierarchyEvalFunc: HierarchyFunction
) {
  await Promise.all(parentData[parentDbClass]?.items?.map(async parentItem => {
    const hierarchySchemes = hierarchyEvalFunc(level, parentItem, parentData)
    if (hierarchySchemes && level < 10) {
      let localData = {} as Data

      const orders = unique(hierarchySchemes.map(i => i.order)).sort()
      const schemeArrays = orders.map((order) => hierarchySchemes.filter((i) => i.order === order))

      for (const schemeArray of schemeArrays) {
        await Promise.all(schemeArray.map(async (fs) =>
          await fetch({ dbName, sdk, ...applyFilters(fs, localData, parentItem, parentData) }, dbClasses)
            .then(async fetchResult => {
              if (fetchResult) {
                localData[fs.dbClass] = fetchResult
                // next level
                if (parentDbClass === fs.dbClass && fetchResult.items?.length) await fetchHierarchy(
                  dbName, sdk, dbClasses, level + 1, parentDbClass, localData, hierarchyEvalFunc
                )
              }
            })
        ))
      }

      directSetRefs(localData, hierarchySchemes)
      parentItem.hierarchyData = localData
    }
  }))
}

export default async function f(request: KuzzleRequest, sdk: EmbeddedSDK, dbClasses: DbClasses) {
  const dbName = request.getString("dbName")
  const baseSchemes = request.getArray("fetchScheme") as BaseFetchScheme[]
  const preparedSchemes = prepareScheme(baseSchemes)

  let data = {} as Data

  let schemeHasError = false
  baseSchemes.map(i => {
    preparedSchemes.map(ps => {
      if (ps[i.dbClass]?.error) {
        data[i.dbClass] = { error: ps[i.dbClass].error }
        schemeHasError = true
      }
    })
  })

  if (!schemeHasError) {
    try {
      const validatedSchemes = preparedSchemes as BaseFetchScheme[]
      const orders = unique(validatedSchemes.map(i => i.order)).sort()
      const schemeArrays = orders.map((order) => validatedSchemes.filter((i) => i.order === order))

      // level 0
      for (const schemeArray of schemeArrays) {
        await Promise.all(schemeArray.map(async (fs) =>
          await fetch({ dbName, sdk, ...applyFilters(fs, data) }, dbClasses)
            .then(async fetchResult => { if (fetchResult) data[fs.dbClass] = fetchResult })
        ))

        directSetRefs(data, validatedSchemes)
      }

      // level 1        
      const schemesWithHierarchy = validatedSchemes.filter(i => i.hierarchyFunc)
      if (schemesWithHierarchy.length) await Promise.all(schemesWithHierarchy.map(async schemeWithHierarchy => {
        await Promise.all(data[schemeWithHierarchy.dbClass]?.items?.map(async parentItem => {
          try {
            const hierarchySchemes = schemeWithHierarchy.hierarchyEvalFunc(1, parentItem, data)
            if (hierarchySchemes) {
              let localData = {} as Data

              const orders = unique(hierarchySchemes.map(i => i.order)).sort()
              const schemeArrays = orders.map((order) => hierarchySchemes.filter((i) => i.order === order))

              for (const schemeArray of schemeArrays) {
                await Promise.all(schemeArray.map(async (fs) => {
                  await fetch({ dbName, sdk, ...applyFilters(fs, localData, parentItem, data) }, dbClasses)
                    .then(async fetchResult => {
                      if (fetchResult) {
                        localData[fs.dbClass] = fetchResult

                        // level 2-9
                        if (schemeWithHierarchy.dbClass === fs.dbClass && fetchResult.items?.length) await fetchHierarchy(
                          dbName, sdk, dbClasses, 2, schemeWithHierarchy.dbClass, localData, schemeWithHierarchy.hierarchyEvalFunc
                        )
                      }
                    })
                }))
              }

              directSetRefs(localData, hierarchySchemes)
              parentItem.hierarchyData = localData
            }
          } catch (error) {
            console.error("Hierarchy func error", error)
            data[schemeWithHierarchy.dbClass] = { error: `Hierarchy func error: ${error.message}` }
          }
        }))
      }))
    } catch (error) {
      console.error("General error", error)
      data = { error: `UseData Kuzzle server general error: ${error.message}` } as any
    }
  }

  return data
}
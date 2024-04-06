import { EmbeddedSDK, KuzzleRequest } from "kuzzle"
import fetch from '../funcs/fetchers/fetch'
import unique from "just-unique"
import directSetRefs from "../funcs/refs/directSetRefs"
import prepareScheme from "../funcs/schemes/prepareFetchScheme"
import { BaseFetchScheme, Data, DbClasses, HierarchyFunction } from "../types"
import applyFilters from '../funcs/filters/applyFilters'

async function fetchBySchemes(
  dbName: string,
  sdk: EmbeddedSDK,
  dbClasses: DbClasses,
  startTime: number,
  level: number,
  schemes: BaseFetchScheme[],
  hierarchyEvalFunc?: HierarchyFunction
): Promise<Data> {
  const preparedSchemes = prepareScheme(schemes)
  let data = {} as Data

  let schemeHasError = false
  schemes.map(i => {
    preparedSchemes.map(ps => {
      if (ps[i.dbClass]?.error) {
        data[i.dbClass] = { error: ps[i.dbClass].error }
        schemeHasError = true
      }
    })
  })

  if (performance.now() - startTime > 5000) {
    console.error(`Hierarchy error: 5 seconds timeout has been reached`)
    data = { any: { error: `Hierarchy error: 5 seconds timeout has been reached` } }
    schemeHasError = true
  }

  if (!schemeHasError) {
    const validatedSchemes = preparedSchemes as BaseFetchScheme[]
    const orders = unique(validatedSchemes.map(i => i.order)).sort()
    const schemeArrays = orders.map((order) => validatedSchemes.filter((i) => i.order === order))

    for (const schemeArray of schemeArrays) {
      await Promise.all(schemeArray.map((fs) =>
        fetch({ dbName, sdk, ...applyFilters(fs, data) }, dbClasses)
          .then(async (fr) => {
            if (fr) { data[fs.dbClass] = fr }

            if (fr && fr.items.length && level < 10) {
              // start propogate hierarchy
              if (fs.hierarchyFunc || fs.hierarchyEvalFunc) {
                await Promise.all(fr.items.map(async parentItem => {
                  try {
                    const hierarchyScheme = fs.hierarchyEvalFunc(parentItem, level, data)
                    if (hierarchyScheme) {
                      const sizeDbClasses: string[] = []
                      hierarchyScheme.map((i: any) => { if (i.size > 1000) sizeDbClasses.push(i.dbClass) })
                      const historyDbClasses: string[] = []
                      hierarchyScheme.map((i: any) => { if (i.history > 1000) historyDbClasses.push(i.dbClass) })
                      if (sizeDbClasses.length) {
                        console.error(`Hierarchy func error: size should be less or equal 1000. Mismatched DB classes: ${sizeDbClasses.join(', ')}`)
                        parentItem.hierarchyData = { [fs.dbClass]: { error: `Hierarchy func error: size should be less or equal 1000. Mismatched DB classes: ${sizeDbClasses.join(', ')}` } }
                      } else if (historyDbClasses.length) {
                        console.error(`Hierarchy func error: history should be less or equal 1000. Mismatched DB classes: ${historyDbClasses.join(', ')}`)
                        parentItem.hierarchyData = { [fs.dbClass]: { error: `Hierarchy func error: history should be less or equal 1000. Mismatched DB classes: ${historyDbClasses.join(', ')}` } }
                      } else parentItem.hierarchyData = await fetchBySchemes(
                        dbName, sdk, dbClasses, startTime, level + 1, hierarchyScheme, fs.hierarchyEvalFunc
                      )
                    }
                  } catch (error) {
                    console.error("Hierarchy func error", error)
                    data[fs.dbClass] = { error: `Hierarchy func error: ${error.message}` }
                  }
                }))
              }

              // continue propogate hierarchy
              if (hierarchyEvalFunc) await Promise.all(fr.items.map(async parentItem => {
                try {
                  const hierarchyScheme = hierarchyEvalFunc(parentItem, level, data)
                  if (hierarchyScheme) parentItem.hierarchyData = await fetchBySchemes(
                    dbName, sdk, dbClasses, startTime, level + 1, hierarchyScheme, hierarchyEvalFunc
                  )
                } catch (error) {
                  console.error("Hierarchy func error", error)
                  data[fs.dbClass] = { error: `Hierarchy func error: ${error.message}` }
                }
              }))
            }

          })
      ))

      data = directSetRefs(data, validatedSchemes)
    }
  }

  return data
}

export default async function f(request: KuzzleRequest, sdk: EmbeddedSDK, dbClasses: DbClasses) {
  const dbName = request.getString("dbName")
  const baseSchemes = request.getArray("fetchScheme") as BaseFetchScheme[]

  const startTime = performance.now()
  return fetchBySchemes(dbName, sdk, dbClasses, startTime, 0, baseSchemes)
}

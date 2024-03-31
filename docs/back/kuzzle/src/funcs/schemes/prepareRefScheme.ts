import unique from "just-unique";
import { Data, SearchScheme } from "../../types"
import mergeFilters from "../filters/mergeFilters";

export default function prepareRefScheme(searchSchemes: SearchScheme[], data: Data,): SearchScheme[] {
  const refSchemes = [] as SearchScheme[]

  for (const searchScheme of searchSchemes) {
    const refs = searchScheme.refs;
    const backRefs = searchScheme.backRefs;

    if (refs?.length) {
      for (const ref of refs) {
        const refScheme = searchSchemes.find((i) => i.dbClass.split("_")[0] === ref)

        if (refScheme) {
          const directItems = data[searchScheme.dbClass.split("_")[0]]?.items
          const refItems = data[ref]?.items

          // ref set
          if (directItems?.length) {
            refSchemes.push({
              ...refScheme,
              filters: mergeFilters(refScheme.filters, {
                ids: {
                  values: unique([
                    ...directItems.map(i => Array.isArray(i[ref]) ? i[ref]?.map(i => i.id) : i[ref]?.id).flat(),
                    ...refItems?.map(i => i.id) || []])
                }
              })
            })
          }

          // direct set
          if (refItems?.length) {
            refSchemes.push({
              ...searchScheme,
              filters: mergeFilters(searchScheme.filters, {
                or: [
                  { ids: { values: unique([...directItems?.map(i => i[ref]?.id) || [], ...directItems?.map(i => i.id) || []]) } },
                  { in: { [`${ref}.id`]: refItems.map(i => i.id) } }
                ]
              })
            })
          }
        }
      }
    }

    if (backRefs?.length) {
      for (const backRef of backRefs) {
        const refScheme = searchSchemes.find((i) => i.dbClass.split("_")[0] === backRef)

        if (refScheme) {
          const directItems = data[searchScheme.dbClass.split("_")[0]]?.items
          const refItems = data[backRef]?.items

          // ref set        
          if (directItems?.length) {
            refSchemes.push({
              ...refScheme,
              filters: mergeFilters(refScheme.filters, {
                or: [
                  { in: { [`${searchScheme.dbClass.split("_")[0]}.id`]: directItems?.map(i => i.id) || [] } },
                  { ids: { values: unique(refItems?.map(i => i.id) || []) } }
                ]
              })
            })
          }

          // direct set        
          if (refItems?.length) {
            refSchemes.push({
              ...searchScheme,
              filters: mergeFilters(searchScheme.filters,
                {
                  ids: {
                    values: unique([
                      ...refItems.filter(i => i[searchScheme.dbClass.split("_")[0]]).map(i => i[searchScheme.dbClass.split("_")[0]].id),
                      ...directItems.map(i => i.id)])
                  }
                }
              )
            })
          }
        }
      }
    }
  }

  return refSchemes
}
import { error } from 'console'
import { BaseFetchScheme } from '../../types'

export default function prepareScheme(
  baseSchemes: BaseFetchScheme[]
): BaseFetchScheme[] | { [dbClass: string]: { error: string } }[] {
  return baseSchemes.map(baseScheme => {
    if (baseScheme.filtersFunc) {
      try { baseScheme = { ...baseScheme, filtersEvalFunc: eval(baseScheme.filtersFunc) } }
      catch (e) {
        console.error("Filters func error", e)
        baseScheme = { [baseScheme.dbClass]: { error: `Filters func error: ${e.message}` } } as any
      }
    }

    if (baseScheme.hierarchyFunc) {
      try { baseScheme = { ...baseScheme, hierarchyEvalFunc: eval(baseScheme.hierarchyFunc) } }
      catch (e) {
        console.error("Hierarchy func error", e)
        baseScheme = { [baseScheme.dbClass]: { error: `Hierarchy func error: ${e.message}` } } as any
      }
    }

    // обратная совместимость с UseData <= v1.2.0    
    if (baseScheme.dbClass?.split('_')?.[0]) baseScheme.dbClass = baseScheme.dbClass.split('_')[0]

    return baseScheme
  })
}

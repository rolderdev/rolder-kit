import { BaseFetchScheme } from '../../types'

export default function prepareScheme(baseSchemes: BaseFetchScheme[]): BaseFetchScheme[] {
  return baseSchemes.map(baseScheme => {
    if (baseScheme.filtersFunc) {
      try { return { ...baseScheme, filtersEvalFunc: eval(baseScheme.filtersFunc) } }
      catch (e) { console.error("Filters eval func error", e) }
    } else return baseScheme
  })
}

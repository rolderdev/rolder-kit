import { SearchScheme } from '../../types'
import mergeFilters from '../filters/mergeFilters'

export default function prepareSearchScheme(searchSchemes: SearchScheme[], searchString: string): SearchScheme[] {
  return searchSchemes.map(searchScheme => {
    const fields = searchScheme.searchFields
    let filters = searchScheme.filters

    if (searchString && fields) {
      const matchFilter = {
        multi_match: {
          fields,
          fuzziness: 1,
          query: searchString
        }
      }

      filters = mergeFilters(filters, matchFilter)
    }

    return { ...searchScheme, filters }
  })
}

import { BaseFetchScheme, Data } from '../../types';
import mergeFilters from './mergeFilters';

export default function applyFilters(
  scheme: BaseFetchScheme[][number],
  data: Data,
): BaseFetchScheme {
  let filters = scheme.filters

  if (scheme.filtersEvalFunc) filters = mergeFilters(filters, scheme.filtersEvalFunc(data))

  return { ...scheme, filters }
}

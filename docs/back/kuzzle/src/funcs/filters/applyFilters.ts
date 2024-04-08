import { BaseFetchScheme, Data, Item } from '../../types';
import mergeFilters from './mergeFilters';

export default function applyFilters(
  scheme: BaseFetchScheme[][number],
  localData: Data,
  parentItem?: Item,
  parentData?: Data
): BaseFetchScheme {
  let filters = scheme.filters

  if (scheme.filtersEvalFunc) filters = mergeFilters(filters, scheme.filtersEvalFunc(localData, parentItem, parentData))

  return { ...scheme, filters }
}

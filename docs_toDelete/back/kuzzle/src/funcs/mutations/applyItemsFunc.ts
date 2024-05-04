import { MutateData, MutateScheme } from '../../types';

export default function applyItemsFunc(
  scheme: MutateScheme[][number],
  data: MutateData,
): MutateScheme {
  let items = scheme.items

  if (scheme.itemsEvalFunc) items = scheme.itemsEvalFunc(items, data)

  return { ...scheme, items }
}

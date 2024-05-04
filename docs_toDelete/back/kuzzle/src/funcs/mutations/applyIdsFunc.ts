import { DeleteData, DeleteScheme } from '../../types';

export default function applyIdsFunc(
  scheme: DeleteScheme[][number],
  data: DeleteData,
): DeleteScheme {
  let ids = scheme.ids

  if (scheme.idsEvalFunc) ids = scheme.idsEvalFunc(ids, data)

  return { ...scheme, ids }
}

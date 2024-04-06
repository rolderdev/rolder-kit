import { Data, BaseFetchScheme } from '../../types';
import { setBackRefs, setRefs } from "./setRefs";

export default function directSetRefs(
  data: Data,
  schemes: BaseFetchScheme[],
): Data {
  for (const [dbClass, dbClassData] of Object.entries(data)) {
    const scheme = schemes.find((i) => i.dbClass === dbClass);
    let itemsWithRefs = dbClassData?.items;

    if (scheme.refs) {
      for (const refDbClass of scheme.refs) {
        if (refDbClass !== dbClass) {
          const refItems = data[refDbClass]?.items;

          if (refItems?.length) {
            itemsWithRefs = setRefs(itemsWithRefs, refDbClass, refItems);
          }
        }
      }
    }

    if (scheme.backRefs) {
      for (const backRefDbClass of scheme.backRefs) {
        if (backRefDbClass !== dbClass) {
          const refItems = data[backRefDbClass]?.items

          if (refItems?.length) {
            itemsWithRefs = setBackRefs(
              dbClass,
              itemsWithRefs,
              backRefDbClass,
              refItems,
            );
          }
        }
      }
    }
  }

  return data;
}

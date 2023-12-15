import isEmpty from "just-is-empty";
import map from "just-map-object"
import typeOf from "just-typeof";

export default function deepFlush(item: unknown) {
    const finalObj: any = {};
    if (item && typeOf(item) === 'object') {
        const untypedItem: any = item
        map(untypedItem, (k, v) => {
            if (typeOf(v) === 'object' && !Array.isArray(v)) {
                const untypedV: any = v
                if (!isEmpty(untypedV)) {
                    const nestedObj = deepFlush(v)
                    if (!isEmpty(nestedObj)) finalObj[k] = nestedObj
                }
            } else if (Array.isArray(v)) {
                v.forEach((i) => {
                    const nestedObj = deepFlush(i)
                    if (nestedObj?.length) finalObj[k] = finalObj[k] ? [...finalObj[k], nestedObj] : [nestedObj]
                })
            } else if (v) finalObj[k] = v
        })
        return finalObj
    } else if (item) return item
    else if (Array.isArray(item)) throw new Error(`It is array, object expected: ${item}`)
}
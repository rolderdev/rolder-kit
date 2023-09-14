import isEmpty from "just-is-empty";
import map from "just-map-object"

export default function deepFlush(item: any) {
    const finalObj: any = {};
    if (item && typeof item === 'object') {
        map(item, (k, v) => {
            if (typeof v === 'object' && !Array.isArray(v)) {
                if (!isEmpty(v)) {
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
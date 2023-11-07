const t = {
    content: {
        profileIds: [
            "companyReader",
            "companyWriter",
            "",
            [],
            {},
            undefined,
            null
        ],
        role: {
            value: "companyManager",
            title: "Менеджер компании",
            test: ''
        }
    },
    credentials: {
        test: undefined,
        local: {
            username: "000000000000000000000",
            password: "4ukac",
            notSecret: "000000000000000000000",
            test: null,
            test2: {},
            test3: [],
        }
    },
    emptyObj: {},
    emptyArr: []
}

/* if (v && typeof v === 'object' && !Array.isArray(v)) {
                const nestedObj = deepFlush(v)
                if (Object.keys(nestedObj).length) finalObj[k] = nestedObj
            } else if (Array.isArray(v)) {
                if (v.length) v.forEach((i) => {
                    const nestedObj = deepFlush(i);
                    if (Object.keys(nestedObj).length) finalObj[k] = finalObj[k] ? [...finalObj[k], nestedObj] : [nestedObj]
                })
            } else if (v !== '' && v !== undefined && v !== null) finalObj[k] = v */

import map from "just-map-object"
import isEmpty from 'just-is-empty'
import flush from 'just-flush'

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


const d = deepFlush(t)
console.log('result', d)
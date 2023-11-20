import { dataCache } from "../molecules"

export default function (noodleNodeId: string, scheme: DataScheme12) {
    const { getValue } = window.R.utils
    const { flush } = window.R.libs.just

    let newScheme: DataScheme12 = { ...scheme }
    let enabled = true
    scheme.filterBy?.forEach(filterScheme => {
        const { dbClassAccessor, filterByDbClass, filterByAccessor } = filterScheme

        const filterByData = flush(dataCache.get()[noodleNodeId]?.[filterByDbClass]?.map((i: any) => {
            const rootKey = filterByAccessor.split('.')[0]
            if (rootKey && Array.isArray(i[rootKey])) {
                const arrayAccesor = filterByAccessor.split('.').slice(1).toString()
                return i[rootKey].map((i: any) => getValue.v8(i, arrayAccesor))
            } else return getValue.v8(i, filterByAccessor)
        }))?.flat()

        if (filterByData?.length) {
            let filter: any = { in: { [dbClassAccessor]: filterByData } }
            if (dbClassAccessor === 'id') filter = { ids: { values: filterByData } }
            if (!scheme.query) newScheme.query = filter
            else if (!scheme.query.and) {
                newScheme.query = { and: [scheme.query, filter] }
            } else newScheme.query?.and.push(filter)
        } else enabled = false
    })
    return { scheme: newScheme, enabled }
}
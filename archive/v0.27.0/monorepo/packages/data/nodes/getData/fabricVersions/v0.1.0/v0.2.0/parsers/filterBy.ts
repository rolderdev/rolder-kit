import { dataCache } from "../getData";

export default function (noodleNodeId: string, dataScheme: GetDataScheme2) {
    dataScheme.filterBy?.forEach(filterDbClass => {
        const filterByIds = dataCache.get()[noodleNodeId]?.[filterDbClass]?.map(i => i.id)
        if (filterByIds) {
            const filter = { in: { [filterDbClass + '.id']: filterByIds } }
            if (!dataScheme.query) dataScheme.query = filter
            else if (!dataScheme.query.and) {
                dataScheme.query = { and: [dataScheme.query, filter] }
            } else dataScheme.query.and.push(filter)
        }
    })
}
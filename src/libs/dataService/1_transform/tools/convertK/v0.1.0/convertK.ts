export default function (kItems: KItem[]): RItem[] {
    return kItems.map(kItem => ({ id: kItem._id, ...kItem._source }))
}

export function convertKUser(kUsers: KUser[]): RUser[] {
    return kUsers.map(kUser => ({ id: kUser._id, ...kUser._source }))
}

export function convertKSearch(response: SearchKResponse): SearchResults {
    const fetchedCount = response.hits.length
    const totalCount = response.total
    let dbClasses: any = {}

    response.hits.forEach(hit => {
        let rItem: any = hit._source
        rItem.id = hit._id
        const dbClass = hit.collection.split('_')[0]
        if (dbClasses[dbClass]) dbClasses[dbClass].push(rItem)
        else dbClasses[dbClass] = [rItem]
    })
    return {
        fetchedCount,
        totalCount,
        ...dbClasses
    }
}
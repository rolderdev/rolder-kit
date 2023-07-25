export const convertOne = (kObject) => {
    let result = kObject._source
    result.id = kObject._id
    return result
}

export const convertMany = (response) => {
    let results = {}
    if (response.hits.length !== 0) {
        results.fetchedCount = response.hits.length
        results.totalCount = response.total
    }
    response.hits.forEach(hit => {
        let result = hit._source
        result.id = hit._id
        const className = hit.collection.split('_')[0]
        if (results[className]) results[className].push(result)
        else results[className] = [result]
    })
    return results
}
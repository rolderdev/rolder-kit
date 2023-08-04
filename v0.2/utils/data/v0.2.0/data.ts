export function getValue(obj: any, nestedKey: string) {
    const Mustache = window.Mustache
    let value = ''
    if (obj && nestedKey) {
        const hasMustche = nestedKey.split('{{')

        try {
            if (hasMustche.length > 1) value = Mustache.render(nestedKey, obj)
            else value = Mustache.render('{{{' + nestedKey + '}}}', obj)
            return value
        } catch (error) {
            return value
        }
    } else return value
}

export function convertForSelect(obj: { value: any; id: any; label: string | undefined }, nestedKey: any) {
    if (obj && nestedKey) {
        obj.value = obj.id
        obj.label = getValue(obj, nestedKey)
        return obj
    } else return undefined
}

export function setRefs(refMap: { [x: string]: string[] }) {
    const Noodl = window.Noodl
    const dbClass = Object.keys(refMap)[0]
    const dbClasses = refMap[dbClass]
    if (dbClass && dbClasses.length) {
        const items = Noodl.Objects[dbClass]?.items
        items.forEach((item: any) => {
            dbClasses.forEach((c: any) => {
                const refItem = Noodl.Objects[item[c].id]
                if (refItem) item[c] = refItem
            })
        })
    }
}

export function dbClassVersion(dbClass: string | number) {
    const { dbClasses } = window.Rolder
    return `${dbClass}_v${dbClasses[dbClass].version}`
}

export function dbVersion() {
    const { project, dbVersion } = window.Rolder
    return project + '_v' + dbVersion
}

export const convertKuzzleResponse = (kObject: { _source: any; _id: any }) => {
    let result = kObject._source
    result.id = kObject._id
    return result
}

export const convertKuzzleResponses = (response: { hits: any[]; total: any }) => {
    let results: any = {}
    if (response.hits.length !== 0) {
        results.fetchedCount = response.hits.length
        results.totalCount = response.total
    }
    response.hits.forEach((hit: { _source: any; _id: any; collection: string }) => {
        let result = hit._source
        result.id = hit._id
        const dbClass = hit.collection.split('_')[0]
        if (results[dbClass]) results[dbClass].push(result)
        else results[dbClass] = [result]
    })
    return results
}

export function filterBy({ initialData, filterByData, filterMap }: { initialData: any, filterByData: any, filterMap: any }) {
    if (initialData && filterByData && filterMap.length) {
        const filteredData: any = {}
        filterMap.forEach((fMap: { self: any[]; op: string; filter: string | number; data: string; has: any[]; by: any[] }) => {
            fMap.self?.forEach((self: string | number) => {
                if (fMap.op === 'append') {
                    filteredData[fMap.filter] = filteredData[fMap.filter].concat(
                        initialData[fMap.filter]?.filter((item: { id: any }) => {
                            if (fMap.data === 'prevStep') {
                                return filteredData[self]?.map((fd: { id: any }) => fd.id).includes(item.id)
                                    && filteredData[fMap.filter].map((fd: { id: any }) => fd.id !== item.id)
                            } else {
                                return filterByData[self]?.map((fd: { id: any }) => fd.id).includes(item.id)
                                    && filteredData[fMap.filter].map((fd: { id: any }) => fd.id !== item.id)
                            }
                        }))
                } else {
                    filteredData[fMap.filter] = initialData[fMap.filter]?.filter((item: { id: any }) => {
                        if (fMap.data === 'prevStep') return filteredData[self]?.map((fd: { id: any }) => fd.id).includes(item.id)
                        else return filterByData[self]?.map((fd: { id: any }) => fd.id).includes(item.id)
                    })
                }
            })
            fMap.has?.forEach((has: string | number) => {
                if (fMap.op === 'append') {
                    filteredData[fMap.filter] = filteredData[fMap.filter].concat(
                        initialData[fMap.filter]?.filter((item: { [x: string]: { id: any }; id: any }) => {
                            if (fMap.data === 'prevStep') {
                                return filteredData[has]?.map((fd: { id: any }) => fd.id).includes(item[has]?.id)
                                    && filteredData[fMap.filter].map((fd: { id: any }) => fd.id !== item.id)
                            } else {
                                return filterByData[has]?.map((fd: { id: any }) => fd.id).includes(item[has]?.id)
                                    && filteredData[fMap.filter].map((fd: { id: any }) => fd.id !== item.id)
                            }
                        }))
                } else {
                    filteredData[fMap.filter] = initialData[fMap.filter]?.filter((item: { [x: string]: { id: any } }) => {
                        if (fMap.data === 'prevStep') return filteredData[has]?.map((fd: { id: any }) => fd.id).includes(item[has]?.id)
                        else return filterByData[has]?.map((fd: { id: any }) => fd.id).includes(item[has]?.id)
                    })
                }
            })
            fMap.by?.forEach((by: string | number) => {
                if (fMap.op === 'append') {
                    filteredData[fMap.filter] = filteredData[fMap.filter].concat(
                        initialData[fMap.filter]?.filter((item: { id: any }) => {
                            if (fMap.data === 'prevStep') {
                                return filteredData[by]?.map((fd: { [x: string]: { id: any } }) => fd[fMap.filter].id).includes(item.id)
                                    && filteredData[fMap.filter].map((fd: { id: any }) => fd.id !== item.id)
                            } else {
                                return filterByData[by]?.map((fd: { [x: string]: { id: any } }) => fd[fMap.filter].id).includes(item.id)
                                    && filteredData[fMap.filter].map((fd: { id: any }) => fd.id !== item.id)
                            }

                        }))
                } else {
                    filteredData[fMap.filter] = initialData[fMap.filter]?.filter((item: { id: any }) => {
                        if (fMap.data === 'prevStep') return filteredData[by]?.map((fd: { [x: string]: { id: any } }) => fd[fMap.filter].id).includes(item.id)
                        else return filterByData[by]?.map((fd: { [x: string]: { id: any } }) => fd[fMap.filter].id).includes(item.id)
                    })
                }
            })
        })

        return filteredData
    }
}
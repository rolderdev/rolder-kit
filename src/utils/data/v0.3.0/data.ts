import _ from 'lodash'
import dayjs from 'dayjs'

export function getValue(obj: any, nestedKey: string | undefined) {
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
export function getDate(obj: any, nestedKey: string | undefined, dateFormat: string | undefined) {
    const Mustache = window.Mustache
    const defaultDateFormat = window.Rolder.defaults.dateFormat
    let value = ''
    if (obj && nestedKey) {
        try {
            return dayjs(Mustache.render(`{{${nestedKey}}}`, obj)).format(dateFormat || defaultDateFormat)
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

export function setRefs(dbClass: string) {
    const Noodl = window.Noodl
    const { dbClasses } = window.Rolder

    function sf(dbClass: string, refDbClass: string) {
        const items: { id: string, [key: string]: any }[] = Noodl.Objects[dbClass]?.items
        items?.forEach(item => {
            if (Array.isArray(item[refDbClass])) {
                item[refDbClass] = item[refDbClass].map((i: any) => {
                    const refItem = Noodl.Objects[i.id]
                    if (refItem) return refItem
                })
            } else {
                const refItem = Noodl.Objects[item[refDbClass].id]
                if (refItem) item[refDbClass] = refItem
            }
        })
    }

    if (dbClass) {
        // если у dbClass есть references
        const refDbClasses = dbClasses[dbClass].references
        refDbClasses?.forEach(refDbClass => sf(dbClass, refDbClass))
        // если dbClass указан у других классов в references
        Object.keys(dbClasses).forEach(tDbClass => {
            const refDbClass = dbClasses[tDbClass].references?.find(r => r === dbClass)
            if (refDbClass) sf(tDbClass, refDbClass)
        })
    }
}

export function setFoudedData(dbClasses: string[], foundedData: { [key: string]: any }) {
    const Noodl = window.Noodl
    const { dbClasses: dbClassesDef } = window.Rolder
    if (dbClasses && foundedData) {
        let resultData: any = {}
        dbClasses.forEach(dbClass => {
            let foundedNItems = foundedData[dbClass]?.length && _.intersectionBy(Noodl.Objects[dbClass]?.items, foundedData[dbClass], 'id')
            if (foundedNItems) {
                resultData[dbClass] = _.unionBy(resultData[dbClass], foundedNItems, 'id')
                // если у dbClass есть references
                let dbRefClasses = dbClassesDef[dbClass].references
                dbRefClasses?.forEach(dbRefClass =>
                    resultData[dbRefClass] = _.unionBy(resultData[dbRefClass], _.map(foundedNItems, dbRefClass), 'id'))
                // если dbClass указан у других классов в references
                dbRefClasses = Object.keys(dbClassesDef).filter(d => dbClassesDef[d].references?.includes(dbClass))
                dbRefClasses?.forEach(dbRefClass => {
                    resultData[dbRefClass] = _.unionBy(resultData[dbRefClass], Noodl.Objects[dbRefClass]?.items
                        ?.filter((n: any) => foundedNItems.map((i: any) => i.id).includes(n[dbClass]?.id)), 'id')
                })
            }
        })
        return resultData
    }
}

export function dbClassVersion(dbClass: string) {
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
                        if (fMap.data === 'prevStep') {
                            return filteredData[by]?.map((fd: { [x: string]: { id: any } }) => fd[fMap.filter].id).includes(item.id)
                        }
                        else return filterByData[by]?.map((fd: { [x: string]: { id: any } }) => fd[fMap.filter].id).includes(item.id)
                    })
                }
            })
        })

        return filteredData
    }
}
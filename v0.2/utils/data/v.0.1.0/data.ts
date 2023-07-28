import { RolderType } from "../../../types/custom-types"

const Mustache = window.Mustache
const Noodl = window.Noodl
const Rolder: RolderType = window.Rolder

export function getValue(obj: Object, nestedKey: string) {
    if (obj && nestedKey) {
        const hasMustche = nestedKey.split('{{')
        let value = ''
        try {
            if (hasMustche.length > 1) value = Mustache.render(nestedKey, obj)
            else value = Mustache.render('{{' + nestedKey + '}}', obj)
            return value
        } catch (error) {
            return undefined
        }
    } else return undefined
}

export function convertForSelect(obj: { value: any, id: string, label?: string }, nestedKey: string) {
    if (obj && nestedKey) {
        obj.value = obj.id
        obj.label = getValue(obj, nestedKey)
        return obj
    } else return undefined
}

export function setRefs(refMap: any) {
    const className: string = Object.keys(refMap)[0]
    const classNames: string[] = refMap[className]
    if (className && classNames.length) {
        const items: any[] = Noodl.Objects[className]?.items
        items.forEach(item => {
            classNames.forEach(c => {
                const refItem = Noodl.Objects[item[c].id]
                if (refItem) item[c] = refItem
            })
        })
    }
}

export function dbClassVersion(dbClass: string) {
    const { dbClasses } = Rolder
    return `${dbClass}_v${dbClasses[dbClass].version}`
}

export function dbVersion() {
    const { project, dbVersion } = Rolder
    return project + '_v' + dbVersion
}

export const convertKuzzleRespone = (kObject: any) => {
    let result = kObject._source
    result.id = kObject._id
    return result
}

export const convertKuzzleRespones = (response: any) => {
    let results: any
    if (response.hits.length !== 0) {
        results.fetchedCount = response.hits.length
        results.totalCount = response.total
    }
    response.hits.forEach((hit: { _source: any; _id: string; collection: string }) => {
        let result = hit._source
        result.id = hit._id
        const dbClass = hit.collection.split('_')[0]
        if (results[dbClass]) results[dbClass].push(result)
        else results[dbClass] = [result]
    })
    return results
}

/* export function filterBy({ initialData, filterByData, filterMap }) {
    if (initialData && filterByData && filterMap.length) {
        const filteredData = {}
        filterMap.forEach(fMap => {
            fMap.self?.forEach(self => {
                if (fMap.op === 'append') {
                    filteredData[fMap.filter] = filteredData[fMap.filter].concat(
                        initialData[fMap.filter]?.filter(item => {
                            if (fMap.data === 'prevStep') {
                                return filteredData[self]?.map(fd => fd.id).includes(item.id)
                                    && filteredData[fMap.filter].map(fd => fd.id !== item.id)
                            } else {
                                return filterByData[self]?.map(fd => fd.id).includes(item.id)
                                    && filteredData[fMap.filter].map(fd => fd.id !== item.id)
                            }
                        }))
                } else {
                    filteredData[fMap.filter] = initialData[fMap.filter]?.filter(item => {
                        if (fMap.data === 'prevStep') return filteredData[self]?.map(fd => fd.id).includes(item.id)
                        else return filterByData[self]?.map(fd => fd.id).includes(item.id)
                    })
                }
            })
            fMap.has?.forEach(has => {
                if (fMap.op === 'append') {
                    filteredData[fMap.filter] = filteredData[fMap.filter].concat(
                        initialData[fMap.filter]?.filter(item => {
                            if (fMap.data === 'prevStep') {
                                return filteredData[has]?.map(fd => fd.id).includes(item[has]?.id)
                                    && filteredData[fMap.filter].map(fd => fd.id !== item.id)
                            } else {
                                return filterByData[has]?.map(fd => fd.id).includes(item[has]?.id)
                                    && filteredData[fMap.filter].map(fd => fd.id !== item.id)
                            }
                        }))
                } else {
                    filteredData[fMap.filter] = initialData[fMap.filter]?.filter(item => {
                        if (fMap.data === 'prevStep') return filteredData[has]?.map(fd => fd.id).includes(item[has]?.id)
                        else return filterByData[has]?.map(fd => fd.id).includes(item[has]?.id)
                    })
                }
            })
            fMap.by?.forEach(by => {
                if (fMap.op === 'append') {
                    filteredData[fMap.filter] = filteredData[fMap.filter].concat(
                        initialData[fMap.filter]?.filter(item => {
                            if (fMap.data === 'prevStep') {
                                return filteredData[by]?.map(fd => fd[fMap.filter].id).includes(item.id)
                                    && filteredData[fMap.filter].map(fd => fd.id !== item.id)
                            } else {
                                return filterByData[by]?.map(fd => fd[fMap.filter].id).includes(item.id)
                                    && filteredData[fMap.filter].map(fd => fd.id !== item.id)
                            }

                        }))
                } else {
                    filteredData[fMap.filter] = initialData[fMap.filter]?.filter(item => {
                        if (fMap.data === 'prevStep') return filteredData[by]?.map(fd => fd[fMap.filter].id).includes(item.id)
                        else return filterByData[by]?.map(fd => fd[fMap.filter].id).includes(item.id)
                    })
                }
            })
        })

        return filteredData
    }
} */
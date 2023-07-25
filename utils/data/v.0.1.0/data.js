export function getValue(obj, nestedKey) {
    if (obj && nestedKey) {
        const hasMustche = nestedKey.split('{{')
        let value = ''
        try {
            if (hasMustche.length > 1) value = mustache.render(nestedKey, obj)
            else value = mustache.render('{{' + nestedKey + '}}', obj)
            return value
        } catch (error) {
            return undefined
        }
    } else return undefined
}

export function convertForSelect(obj, nestedKey) {
    if (obj && nestedKey) {
        obj.value = obj.id
        obj.label = getValue(obj, nestedKey)
        return obj
    } else return undefined
}

export function setRefs(refMap) {
    const className = Object.keys(refMap)[0]
    const classNames = refMap[className]
    if (className && classNames.length) {
        const items = Noodl.Objects[className]?.items
        items.forEach(item => {
            classNames.forEach(c => {
                const refItem = Noodl.Objects[item[c].id]
                if (refItem) item[c] = refItem
            })
        })
    }
}

export function classVersion(className) {
    const { classes } = Rolder
    return className + '_v' + classes[className].version
}

export function dbVersion() {
    const { project, dbVersion } = Rolder
    return project + '_v' + dbVersion
}

export function filterBy({ initialData, filterByData, filterMap }) {
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
}
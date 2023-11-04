import { dataCache, searchCache } from "../Data";

function sortItems(dataScheme: DataScheme, items: RItem[]) {
    const sort: any = dataScheme.sort
    if (sort) items = window.R.libs.sort(items).by(sort.map((s: any) => {
        const order = s[Object.keys(s)[0]]
        const key = Object.keys(s)[0]
        return { [order]: (i: any) => window.R.utils.getValue.v7(i, key) }
    }))

    return items
}

function getItemsByFoundedRefs(noodlNodeId: string, searchResults: SearchResults11, targetDataScheme: DataScheme, refDataScheme: DataScheme) {
    const { unionBy } = window.R.libs.lodash

    const allTargetItems = dataCache.get()[noodlNodeId][targetDataScheme.dbClass]
    const foundedTargetItems = searchResults[targetDataScheme.dbClass]
    const foundedRefItems = searchCache.get()[noodlNodeId][refDataScheme.dbClass]
    const targetItemsFromRefs = allTargetItems.filter(i => foundedRefItems.map(i => i.id).includes(i[refDataScheme.dbClass].id))
    const targetItemsFromBRefs = allTargetItems.filter(i => foundedRefItems.map(i => i[targetDataScheme.dbClass]?.id).includes(i.id))
    let resultTargetItems = unionBy(foundedTargetItems, [...targetItemsFromRefs, ...targetItemsFromBRefs], 'id')

    return sortItems(targetDataScheme, resultTargetItems)
}

export default function (noodlNodeId: string, useDataScheme: DataScheme[]) {
    const { unionBy } = window.R.libs.lodash

    let searchResults: SearchResults11 = {}
    useDataScheme.filter(i => i.search?.setOutput).forEach(outputDataScheme => {
        const setOutput = outputDataScheme.search?.setOutput
        if (setOutput === true) {
            const outputItems = unionBy(searchCache.get()[noodlNodeId][outputDataScheme.dbClass], searchResults[outputDataScheme.dbClass], 'id')
            searchResults[outputDataScheme.dbClass] = sortItems(outputDataScheme, outputItems)
        } else if (typeof setOutput === 'object') {
            Object.keys(setOutput).forEach(fromDbClass => {
                const toScheme = setOutput[fromDbClass]
                // self
                if (outputDataScheme.dbClass === fromDbClass) {
                    const outputItems =
                        unionBy(searchCache.get()[noodlNodeId][outputDataScheme.dbClass], searchResults[outputDataScheme.dbClass], 'id')
                    searchResults[outputDataScheme.dbClass] = sortItems(outputDataScheme, outputItems)
                } else if (toScheme.to === outputDataScheme.dbClass) {
                    const fromDataScheme = useDataScheme.find(i => i.dbClass === fromDbClass)
                    if (fromDataScheme) {
                        searchResults[outputDataScheme.dbClass] =
                            getItemsByFoundedRefs(noodlNodeId, searchResults, outputDataScheme, fromDataScheme)
                    }
                } else if (Object.keys(toScheme).length == 2) {
                    const fromDataScheme = useDataScheme.find(i => i.dbClass === fromDbClass)
                    const toDataScheme = useDataScheme.find(i => i.dbClass === toScheme.to)
                    if (fromDataScheme && toDataScheme) {
                        const toItems = getItemsByFoundedRefs(noodlNodeId, searchResults, toDataScheme, fromDataScheme)
                        searchCache.setKey(`${noodlNodeId}.${toDataScheme.dbClass}`, toItems)
                        searchResults[outputDataScheme.dbClass] =
                            getItemsByFoundedRefs(noodlNodeId, searchResults, outputDataScheme, toDataScheme)
                    }
                }
            })
        }
    })
    return searchResults
}
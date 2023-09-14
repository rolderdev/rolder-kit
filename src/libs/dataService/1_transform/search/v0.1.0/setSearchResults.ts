import { sort } from "fast-sort"
import map from "just-map-object"
import { isArray, uniqBy } from "lodash"
import getValue from "../../../../../utils/data/getValue/v0.4.0/getValue"

export default function (dbClass: string, searchResults: SearchResults, sorts: any, useReferences: boolean | undefined): SearchNResults {
    const Noodl = window.Noodl
    let nItems: NItem[] = []
    let nSearchResults: { [k: string]: NItem[] } = {}

    map(searchResults, (k, rItems) => {
        if (isArray(rItems)) {
            nSearchResults[k] = rItems.map(i => Noodl.Object.create(i))
            if (k === dbClass) nItems = nSearchResults[k]
        }
    })

    if (useReferences) {
        map(nSearchResults, (k, foundedNItems) => {
            if (k !== dbClass) {
                foundedNItems.forEach(foundedNItem => {
                    nItems.push(Noodl.Objects[dbClass]?.items.find((i: NItem) => i[k].id === foundedNItem.id))
                })
            }
        })

        nItems = sort(nItems).by(sorts?.map((s: any) => {
            const order = s[Object.keys(s)[0]]
            const key = Object.keys(s)[0]
            return { [order]: (i: any) => getValue(i, key) }
        }))
    }

    return {
        fetchedCount: nItems.length,
        totalCount: useReferences ? nItems.length : searchResults.totalCount,
        items: uniqBy(nItems, (v) => v.id)
    }
}
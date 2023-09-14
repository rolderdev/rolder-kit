import { sort } from "fast-sort"
import setRefs from "../../tools/setRefs/v0.5.0/setRefs"
import getValue from "../../../../../utils/data/getValue/v0.4.0/getValue"
import { setSorts } from "../../../0_query/tools/setDefaults/v0.2.0/setDefaults"

export default function (dbClass: string, rItem: RItem | RUser, sorts?: any) {
    const { Noodl } = window
    let nItems = Noodl.Objects[dbClass].items
    const s: any = setSorts(dbClass, sorts)
    
    const nItem = Noodl.Object.create(rItem)
    nItems.push(nItem)
    nItems = sort(nItems).by(s?.map((s: any) => {
        const order = s[Object.keys(s)[0]]
        const key = Object.keys(s)[0]
        return { [order]: (i: any) => getValue(i, key) }
    }))

    Noodl.Objects[dbClass].setAll({
        fetchedCount: Noodl.Objects[dbClass].fetchedCount + 1,
        totalCount: Noodl.Objects[dbClass].totalCount + 1,
        items: nItems
    })

    setRefs(dbClass)
    return nItem
}
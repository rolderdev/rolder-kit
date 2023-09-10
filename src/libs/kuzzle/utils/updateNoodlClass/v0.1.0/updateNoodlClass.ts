import { sort } from "fast-sort";
import setRefs from "../../../../../utils/data/setRefs/v0.4.0/setRefs";
import getValue from "../../../../../utils/data/getValue/v0.4.0/getValue";

function updateNoodlClass(props: { dbClass: string, rawItems?: Item[], action?: string, item?: Item, sorts?: any }) {
    const { Noodl } = window
    const { dbClass, action, item, sorts } = props

    let rawItems = props.rawItems || Noodl.Objects[dbClass]?.items?.map((i: any) => ({ ...i.data, id: i.id }))
    let fetchedCount = Noodl.Objects[dbClass].fetchedCount
    let totalCount = Noodl.Objects[dbClass].totalCount
    if (item) {
        switch (action) {
            case 'update': {
                rawItems = rawItems?.map((rowItem: Item) => {
                    if (rowItem.id === item.id) return { ...Noodl.Objects[item.id], ...item }
                    else return rowItem
                });
            } break
            case 'create': {
                rawItems.push({ ...Noodl.Objects[item.id], ...item })
                rawItems = sort(rawItems).by(sorts?.map((s: any) => {
                    const order = s[Object.keys(s)[0]]
                    const key = Object.keys(s)[0]
                    return { [order]: (i: any) => getValue(i, key) }
                }))
                fetchedCount++
                totalCount++
            } break
            case 'delete': {
                rawItems = rawItems?.items?.filter((i: any) => i.id !== item.id)
                fetchedCount--
                totalCount--
            }
        }
    }
    Noodl.Objects[dbClass].setAll({
        dbClass,
        items: rawItems?.map((o: any) => Noodl.Object.create(o)),
        fetchedCount,
        totalCount
    })
    setRefs(dbClass)
}

export default function (props: { dbClass: string, rawItems?: Item[], action?: string, item?: Item, sorts?: Sorts }) {
    const { Noodl } = window
    const { dbClass, action, item, sorts, rawItems } = props

    if (!rawItems) updateNoodlClass({ dbClass, action, item, sorts })
    else updateNoodlClass({ dbClass, rawItems })

    const dbClasses = eval(Noodl.getProjectSettings().dbClasses)[0]
    Object.keys(dbClasses).forEach(i => { if (dbClasses[i].references?.includes(dbClass)) updateNoodlClass({ dbClass: i }) })
}
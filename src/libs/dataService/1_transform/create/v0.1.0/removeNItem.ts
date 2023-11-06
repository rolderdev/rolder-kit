import setRefs from "../../tools/setRefs/v0.5.0/setRefs"

export default function (dbClass: string, rItem: RItem) {
    const { Noodl } = window

    Noodl.Objects[dbClass].setAll({
        fetchedCount: Noodl.Objects[dbClass].fetchedCount - 1,
        totalCount: Noodl.Objects[dbClass].totalCount - 1,
        items: Noodl.Objects[dbClass].items?.filter((i: any) => i.id !== rItem.id)
    })

    setRefs(dbClass)
}
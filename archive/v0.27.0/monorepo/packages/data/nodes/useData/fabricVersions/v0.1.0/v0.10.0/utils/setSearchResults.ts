export default function (
    dbClass: string, resultDbClasses: string[], allRItems: RItem[], refs?: string[], backRef?: string[], sorts?: any
): RItem[] {
    const { map } = window.R.libs.just

    const mainDbClassRItems: RItem[] = allRItems.filter(i => i.dbClass === dbClass).filter(i => resultDbClasses.includes(i.dbClass))
    const refRItems: RItem[] = allRItems.filter(i => refs?.includes(i.dbClass)).filter(i => resultDbClasses.includes(i.dbClass))
    const backRefRItems: RItem[] = allRItems.filter(i => backRef?.includes(i.dbClass)).filter(i => resultDbClasses.includes(i.dbClass))

    let resultRItems = mainDbClassRItems || []

    refRItems.forEach(refRItem => {
        let targetRItem: any = undefined
        map(window.Noodl.Object._models as any, (itemId, _item) => {
            const nItem = window.Noodl.Objects[itemId]
            if (nItem && resultDbClasses.includes(nItem.dbClass) && nItem[refRItem.dbClass]?.id === refRItem.id) targetRItem = nItem
            if (targetRItem && !resultRItems.map(i => i.id).includes(targetRItem.id)) resultRItems.push(targetRItem)
        })
    })
    backRefRItems.forEach((refRItem: any) => {
        let targetRItem: any = undefined
        map(window.Noodl.Object._models as any, (itemId, _item) => {
            const nItem = window.Noodl.Objects[itemId]
            if (nItem && resultDbClasses.includes(nItem.dbClass) && refRItem[dbClass]?.id === nItem.id) targetRItem = nItem
            if (targetRItem && !resultRItems.map(i => i.id).includes(targetRItem.id)) resultRItems.push(targetRItem)
        })
    })
    if (sorts) resultRItems = window.R.libs.sort(resultRItems).by(sorts.map((s: any) => {
        const order = s[Object.keys(s)[0]]
        const key = Object.keys(s)[0]
        return { [order]: (i: any) => window.R.utils.getValue.v7(i, key) }
    }))

    return resultRItems
}
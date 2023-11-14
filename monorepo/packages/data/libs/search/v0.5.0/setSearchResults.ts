export default function (dbClass: string, allRItems: RItem[], sorts: any, useReferences: boolean | undefined): SearchResults {
    const { map, get } = window.R.libs.just

    const targetDbClassRItems: RItem[] = allRItems.filter(i => i.dbClass === dbClass)
    const refDbClassRItems: RItem[] = allRItems.filter(i => i.dbClass !== dbClass)
    let resultRItems = targetDbClassRItems || []

    if (useReferences) {
        refDbClassRItems.forEach(refRItem => {
            let targetRItem: any = undefined
            map(window.Noodl.Object._models as any, (itemId, _item) => {
                const nItem = window.Noodl.Objects[itemId]
                if (nItem && nItem[refRItem.dbClass]?.id === refRItem.id) targetRItem = nItem
            })
            if (targetRItem && !resultRItems.map(i => i.id).includes(targetRItem.id)) resultRItems.push(targetRItem)
        })
        resultRItems = window.R.libs.sort(resultRItems).by(sorts?.map((s: any) => {
            const order = s[Object.keys(s)[0]]
            const key = Object.keys(s)[0]
            return { [order]: (i: any) => window.R.utils.getValue.v7(i, key) }
        }))
    }

    return {
        fetchedCount: resultRItems.length,
        items: resultRItems
    }
}
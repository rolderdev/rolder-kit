export default function (dbClass: string) {
    const Noodl = window.Noodl
    const dbClasses: { [key: string]: DbClass } = eval(Noodl.getProjectSettings().dbClasses)[0]
    function sf(dbClass: string, refDbClass: string) {
        const items: { id: string, [key: string]: any }[] = Noodl.Objects[dbClass]?.items
        items?.forEach(item => {
            if (Array.isArray(item[refDbClass])) {
                item[refDbClass] = item[refDbClass]?.map((i: any) => {
                    const refItem = Noodl.Objects[i.id]
                    if (refItem) return refItem
                })
            } else {
                const refItem = Noodl.Objects[item[refDbClass]?.id]
                if (refItem) item[refDbClass] = refItem
            }
        })
    }

    if (dbClass) {
        // если у dbClass есть references
        const refDbClasses = dbClasses[dbClass]?.references
        refDbClasses?.forEach(refDbClass => sf(dbClass, refDbClass))
        // если dbClass указан у других классов в references
        Object.keys(dbClasses).forEach(tDbClass => {
            const refDbClass = dbClasses[tDbClass]?.references?.find(r => r === dbClass)
            if (refDbClass) sf(tDbClass, refDbClass)
        })
    }
}
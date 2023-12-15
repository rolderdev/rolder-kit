import map from "just-map-object"

export default function (dbClass: string) {
    const { QueryClient, Noodl } = window
    const dbClasses: DbClassesDef = eval(Noodl.getProjectSettings().dbClasses)[0]
    let revReferences: string[] = []
    map(dbClasses, (k, v) => { if (v?.references?.includes(dbClass)) revReferences.push(k) })

    function triggerQuery(dbClass: string) {
        QueryClient.setQueriesData<QClass>({ queryKey: [{ dbClass }] }, (oldQClassData) => {
            const version = oldQClassData?.version && oldQClassData.version + 1
            return { ...Noodl.Objects[dbClass], version }
        })
    }

    triggerQuery(dbClass)
    revReferences.forEach(ref => triggerQuery(ref))
}
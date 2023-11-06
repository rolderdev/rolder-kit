export default function (dbClass: string, sorts: Sorts) {
    const defaultSorts = eval(window.Noodl.getProjectSettings().dbClasses)?.[0][dbClass]?.defaults?.sorts
    const s = sorts || []
    return [...defaultSorts, ...s]
}
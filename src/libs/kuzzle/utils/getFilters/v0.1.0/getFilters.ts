export default function (dbClass: string, filters: Filters) {
    const defaultFilters = eval(window.Noodl.getProjectSettings().dbClasses)?.[0][dbClass]?.defaults?.filters
    return { ...defaultFilters, ...filters }
}
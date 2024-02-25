export function setFilters(dbClass: string, filters?: Filters) {
    const defaultFilters = eval(window.Noodl.getProjectSettings().dbClasses)?.[0][dbClass]?.defaults?.filters
    return window.R.libs.just.isEmpty(filters) ? defaultFilters || {} : filters
}
export function setSorts(dbClass: string, sorts?: Sorts) {
    const defaultSorts = eval(window.Noodl.getProjectSettings().dbClasses)?.[0][dbClass]?.defaults?.sorts
    return window.R.libs.just.isEmpty(sorts) ? defaultSorts || [] : sorts
}
export function setOptions(dbClass: string, options?: Options) {
    const defaultOptions = eval(window.Noodl.getProjectSettings().dbClasses)?.[0][dbClass]?.defaults?.options
    return { ...defaultOptions, ...options, lang: 'koncorde', silent: true }
}
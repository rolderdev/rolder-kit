export function setFilters(dbClass: string, filters: Filters) {
    const defaultFilters = eval(window.Noodl.getProjectSettings().dbClasses)?.[0][dbClass]?.defaults?.filters
    return { ...defaultFilters, ...filters }
}
export function setSorts(dbClass: string, sorts?: Sorts) {
    const defaultSorts = eval(window.Noodl.getProjectSettings().dbClasses)?.[0][dbClass]?.defaults?.sorts || []
    const s = sorts || []
    return [...defaultSorts, ...s]
}
export function setOptions(dbClass: string, options?: Options) {
    const defaultOptions = eval(window.Noodl.getProjectSettings().dbClasses)?.[0][dbClass]?.defaults?.options
    //const subscribe = !window.Noodl.Objects[dbClass].subscribe && { refresh: 'wait_for' }
    return { ...defaultOptions, ...options, lang: 'koncorde', silent: true }
}
export function dbClassVersion(dbClass: string) {
    const { dbClasses } = window.R.params
    return `${dbClass}_v${dbClasses?.[dbClass].version}`
}

export function dbVersion() {
    const { project, dbVersion } = window.R.env
    return project + '_v' + dbVersion
}
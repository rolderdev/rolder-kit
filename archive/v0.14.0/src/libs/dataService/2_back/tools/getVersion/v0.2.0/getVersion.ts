export function dbClassVersion(dbClass: string) {
    const { dbClasses } = window.Rolder
    return `${dbClass}_v${dbClasses[dbClass].version}`
}

export function dbVersion() {
    const { project, dbVersion } = window.Rolder
    return project + '_v' + dbVersion
}
export function dbClassVersion(dbClass: string) {
    const { dbClasses } = window.R
    return `${dbClass}_v${dbClasses?.[dbClass].version}`
}
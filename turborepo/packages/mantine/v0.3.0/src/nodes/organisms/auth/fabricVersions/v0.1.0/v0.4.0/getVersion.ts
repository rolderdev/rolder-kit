export function dbClassVersion(dbClass: string) {
    const { dbClasses } = window.R
    // @ts-ignore
    return `${dbClass}_v${dbClasses?.[dbClass].version}`
}
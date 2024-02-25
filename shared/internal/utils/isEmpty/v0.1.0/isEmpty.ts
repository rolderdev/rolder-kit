export default function (value: any): boolean {
    if (typeof value === 'boolean') return false
    if (typeof value === 'number') return false
    if (Array.isArray(value)) {
        if (value.length > 0) return false
        else return true
    }
    return !Boolean(value)
}
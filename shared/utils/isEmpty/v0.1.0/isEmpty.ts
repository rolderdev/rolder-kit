export default function (value: any): boolean {
    if (typeof value === 'boolean') return false
    return !Boolean(value)
}
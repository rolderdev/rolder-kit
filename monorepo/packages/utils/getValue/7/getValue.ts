export default function (item: any, target: string, defaultValue?: any) {
    const { template, get } = window.R.libs
    if (item && target) {
        const hasTemplate = target.split('{{')?.length > 1
        if (hasTemplate) return template(target, item)
        else return get(item, target, defaultValue)
    }
    return undefined
}
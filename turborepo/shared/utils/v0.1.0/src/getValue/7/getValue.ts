import get from 'just-safe-get'
import template from 'just-template'

export default function (item: any, target: string, defaultValue?: any) {
    if (item && target) {
        const hasTemplate = target.split('{{')?.length > 1
        if (hasTemplate) return template(target, item)
        else return get(item, target, defaultValue)
    }
    return undefined
}
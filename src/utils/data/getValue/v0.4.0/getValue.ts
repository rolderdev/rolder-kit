import template from "just-template"

export default function (obj: any, templ: string | undefined) {
    let value = ''
    if (obj?.data && templ) {
        const hasTemplate = templ.split('{{')
        try {
            if (hasTemplate.length > 1) value = template(templ, obj)
            else value = template(`{{${templ}}}`, obj)
            return value
        } catch (error) {
            return value
        }
    } else return value
}
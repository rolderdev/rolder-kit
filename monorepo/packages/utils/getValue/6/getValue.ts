export default function (obj: any, templ: string | undefined, defaultValue?: any) {
    const { template } = window.R.libs.just

    let value = ''
    if (obj?.data && templ) {
        const hasTemplate = templ.split('{{')
        try {
            let valuesCount = 0
            hasTemplate.slice(1).forEach(t => { if (template(`{{${t.split('}}')[0]}}}`, obj)) valuesCount++ })
            if (hasTemplate.length > 1) {
                if (valuesCount) value = template(templ, obj)
                else value = defaultValue || value
            } else if (template(`{{${templ}}}`, obj)) value = template(`{{${templ}}}`, obj)
            else value = defaultValue || value

            return value
        } catch (error) {
            return value
        }
    } else return value
}
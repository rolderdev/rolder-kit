import getValue from "../../getValue/6/getValue"

export default function (obj: any, templ: string | undefined, dateFormat: string | undefined) {
    const { dayjs } = window.R.libs
    const defaultDateFormat = window.R.params.defaults?.dateFormat
    let value = ''
    if (obj && templ) {
        try {
            return dayjs(getValue(obj, templ)).format(dateFormat || defaultDateFormat)
        } catch (error) {
            return value
        }
    } else return value
}
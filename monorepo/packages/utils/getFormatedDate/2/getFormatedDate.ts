export default function (obj: any, templ: string | undefined, dateFormat: string | undefined) {
    const { dayjs } = window.R.libs
    const { getValue } = window.R.utils
    const defaultDateFormat = window.R.params.defaults?.dateFormat
    let value = ''
    if (obj && templ) {
        try {
            return dayjs(getValue.v7(obj, templ)).format(dateFormat || defaultDateFormat)
        } catch (error) {
            return value
        }
    } else return value
}
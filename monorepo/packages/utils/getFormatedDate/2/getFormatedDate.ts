export default function (obj: any, templ: string | undefined, dateFormat: string | undefined) {
    const { dayjs } = window.R.libs
    const { getValue } = window.R.utils
    const defaultDateFormat = window.R.params.defaults?.dateFormat
    let value = ''
    if (obj && templ) {
        const v = getValue.v7(obj, templ)
        if (v) {
            if (dayjs.unix(v).format() !== 'Invalid Date') return dayjs.unix(v).format(dateFormat || defaultDateFormat)
            else if (dayjs(v).format() !== 'Invalid Date') return dayjs(v).format(dateFormat || defaultDateFormat)
        } else return value
    } else return value
}
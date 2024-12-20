//// DEPRECATED???

import '@shared/types-v0.1.0'
import getValue from '@shared/get-value'

export default function (obj: any, templ: string | undefined, dateFormat: string | undefined) {
	const { dayjs } = R.libs
	const defaultDateFormat = window.R.params.defaults?.dateFormat
	const value = ''
	if (obj && templ) {
		const v = getValue(obj, templ)
		if (v) {
			if (dayjs(v).format() !== 'Invalid Date') return dayjs(v).format(dateFormat || defaultDateFormat)
		} else return value
	} else return value
	return
}

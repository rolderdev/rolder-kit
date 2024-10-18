import isObjectEmpty from 'just-is-empty'
import typeOf from 'just-typeof'

export default function (value: any): boolean {
	if (typeof value === 'boolean') return false
	if (typeof value === 'number') return false
	/*     if (Array.isArray(value)) {
        if (value.length > 0) return false
        else return true
    } */
	//@ts-ignore
	if (typeOf(value) === 'object' && isObjectEmpty(value)) return true
	return !Boolean(value)
}

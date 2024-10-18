// string
import capitalize from 'just-capitalize'
import clone from 'just-clone'
import compare from 'just-compare'
import extend from 'just-extend'
import flush from 'just-flush'
// object
import has from 'just-has'
import insert from 'just-insert'
import isEmpty from 'just-is-empty'
// array
import last from 'just-last'
import map from 'just-map-object'
import omit from 'just-omit'
import pick from 'just-pick'
import range from 'just-range'
import get from 'just-safe-get'
import set from 'just-safe-set'
import sortBy from 'just-sort-by'
import template from 'just-template'
import typeOf from 'just-typeof'
import unique from 'just-unique'

const just = {
	typeOf,
	compare,
	clone,
	has,
	get,
	set,
	map,
	pick,
	omit,
	template,
	flush,
	isEmpty,
	extend,
	last,
	unique,
	insert,
	range,
	sortBy,
	capitalize,
}

export type Just = typeof just
set(window, ['R', 'libs', 'just'], just)

export {
	typeOf,
	compare,
	clone,
	has,
	get,
	set,
	map,
	pick,
	omit,
	template,
	flush,
	isEmpty,
	extend,
	last,
	unique,
	insert,
	range,
	sortBy,
	capitalize,
}

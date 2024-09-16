import typeOf from 'just-typeof';
import compare from 'just-compare';
import clone from 'just-clone';
// object
import has from 'just-has';
import get from 'just-safe-get';
import set from 'just-safe-set';
import map from 'just-map-object';
import pick from 'just-pick';
import omit from 'just-omit';
import template from 'just-template';
import flush from 'just-flush';
import isEmpty from 'just-is-empty';
import extend from 'just-extend';
// array
import last from 'just-last';
import unique from 'just-unique';
import insert from 'just-insert';
import range from 'just-range';
import sortBy from 'just-sort-by';
// string
import capitalize from 'just-capitalize';

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
};

export type Just = typeof just;
set(window, ['R', 'libs', 'just'], just);

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
};

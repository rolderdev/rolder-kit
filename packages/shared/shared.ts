import '@shared/types-v0.1.0';

// jsut
import typeOf from 'just-typeof';
import compare from 'just-compare';
import clone from 'just-clone';
//// object
import get from 'just-safe-get';
import set from 'just-safe-set';
import map from 'just-map-object';
import omit from 'just-omit';
//// array
import last from 'just-last';
import unique from 'just-unique';

export type Just = {
	typeOf: typeof typeOf;
	compare: typeof compare;
	clone: typeof clone;
	get: typeof get;
	set: typeof set;
	map: typeof map;
	omit: typeof omit;
	last: typeof last;
	unique: typeof unique;
};
set(R, ['libs', 'just'], { typeOf, compare, clone, get, set, map, omit, last, unique });

import { nanoid } from 'nanoid';
export type Nanoid = typeof nanoid;
import { sort } from 'fast-sort';
export type Sort = typeof sort;

set(R, ['libs'], { nanoid, sort });

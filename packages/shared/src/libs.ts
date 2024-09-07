import { set } from './libs/just';

// lodash
import unset from 'lodash.unset';
export type Lodash = { unset: typeof unset };
set(window, ['R', 'libs', 'lodash'], { unset });

// remeda
import { uniqueWith } from 'remeda';
export type Remeda = {
	// array
	uniqueWith: typeof uniqueWith;
};
set(window, ['R', 'libs', 'remeda'], { uniqueWith });

import deepmerge from '@fastify/deepmerge';
export type Deepmerge = typeof deepmerge;
set(window, ['R', 'libs', 'deepmerge'], deepmerge);

import { nanoid } from 'nanoid';
export type Nanoid = typeof nanoid;
set(window, ['R', 'libs', 'nanoid'], nanoid);

import { sort } from 'fast-sort';
export type Sort = typeof sort;
set(window, ['R', 'libs', 'sort'], sort);

import generatePassword from 'omgopass';
export type Omgopass = typeof generatePassword;
set(window, ['R', 'libs', 'generatePassword'], generatePassword);

import './libs/dayjs';
import './libs/just';
import './libs/numbro';
import './libs/valibot';
import './libs/valtio';

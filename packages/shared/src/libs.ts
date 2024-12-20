import { set } from './libs/just'

import merge from 'lodash.merge'
// lodash
import unset from 'lodash.unset'
const lodash = { unset, merge }
export type Lodash = typeof lodash
set(window, ['R', 'libs', 'lodash'], lodash)

// remeda
import { debounce, sumBy, take, uniqueWith } from 'remeda'
const remeda = { uniqueWith, take, debounce, sumBy }
export type Remeda = typeof remeda
set(window, ['R', 'libs', 'remeda'], remeda)

import { nanoid } from 'nanoid'
export type Nanoid = typeof nanoid
set(window, ['R', 'libs', 'nanoid'], nanoid)

import { sort } from 'fast-sort'
export type Sort = typeof sort
set(window, ['R', 'libs', 'sort'], sort)

import generatePassword from 'omgopass'
export type Omgopass = typeof generatePassword
set(window, ['R', 'libs', 'generatePassword'], generatePassword)

import './libs/dayjs'
import './libs/just'
import './libs/numbro'
import './libs/valibot'
import './libs/valtio'

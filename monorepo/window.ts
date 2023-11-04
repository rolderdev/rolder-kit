//// libs
import { Kuzzle, WebSocket } from 'kuzzle-sdk'
const kuzzle = new Kuzzle(new WebSocket(`rolder.app`, { port: 443 }))
import mutator from './packages/data/libs/mutator/v0.1.0/mutator';
import dayjs from 'dayjs'
import cookies from 'js-cookie';
import numbro from 'numbro';
import { IMask } from 'react-imask';
import { sort } from "fast-sort"
import generatePassword from "omgopass";
import ms from "ms"
// just
import clone from "just-clone";
import map from "just-map-object";
import typeOf from "just-typeof"
import flush from "just-flush";
import template from "just-template";
import isObjectEmpty from 'just-is-empty';
import isEmpty from 'just-is-empty'
import omit from 'just-omit'
import insert from 'just-insert'
import get from 'just-safe-get';
import set from 'just-safe-set';
import clamp from 'just-clamp'
import last from "just-last"
import remove from 'just-remove'
import sortBy from 'just-sort-by';
import unique from 'just-unique'
import compare from 'just-compare'
import flatten from 'just-flatten-it';
import debounce from 'just-debounce-it'
import capitalize from 'just-capitalize';
// loadsh
import { isNil, unionBy } from 'lodash'
// form
import { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField } from '@mantine/form'

//// utils
import getValue6 from './packages/utils/getValue/6/getValue';
import getValue7 from './packages/utils/getValue/7/getValue';
import getValue8 from './packages/utils/getValue/8/getValue';
import getFormatedDate2 from './packages/utils/getFormatedDate/2/getFormatedDate';
import getMasked2 from './packages/utils/getMasked/2/getMasked';
import filterBy from './packages/utils/filterBy/3/filterBy';

declare type DbClass = {
    version: number
}

declare type RolderType = {
    states: {
        debug: number
    }
    env: {
        rolderKit: string
        project?: string
        projectVersion?: string
        envVersion?: string
        dbVersion?: number
    }
    params: {
        dbClasses?: {
            [x: string]: any//DbClass
        }
        sessionTimeout: string
        defaults?: {
            dateFormat: string
        }
    }
    dbClasses?: {
        [x: string]: DbClass
    }
    libs: {
        Kuzzle: typeof kuzzle
        mutator: typeof mutator
        dayjs: typeof dayjs
        cookies: typeof cookies
        numbro: typeof numbro
        IMask: typeof IMask
        sort: typeof sort
        generatePassword: typeof generatePassword
        ms: typeof ms
        form: {
            isNotEmpty: typeof isNotEmpty
            isEmail: typeof isEmail
            matches: typeof matches
            isInRange: typeof isInRange
            hasLength: typeof hasLength
            matchesField: typeof matchesField
        }
        clone: typeof clone
        map: typeof map
        typeOf: typeof typeOf
        flush: typeof flush
        template: typeof template
        isObjectEmpty: typeof isObjectEmpty
        omit: typeof omit
        insert: typeof insert
        get: typeof get
        clamp: typeof clamp
        just: {
            clone: typeof clone
            map: typeof map
            typeOf: typeof typeOf
            flush: typeof flush
            template: typeof template
            isEmpty: typeof isEmpty
            omit: typeof omit
            insert: typeof insert
            get: typeof get
            set: typeof set
            clamp: typeof clamp
            last: typeof last
            remove: typeof remove
            sortBy: typeof sortBy
            unique: typeof unique
            compare: typeof compare
            flatten: typeof flatten
            debounce: typeof debounce
            capitalize: typeof capitalize
        }
        isNil: typeof isNil
        lodash: {
            isNil: typeof isNil
            unionBy: typeof unionBy
        }
    }
    utils: {
        getValue: {
            v6: typeof getValue6
            v7: typeof getValue7
            v8: typeof getValue8
        }
        getFormatedDate: {
            v2: typeof getFormatedDate2
        }
        getMasked: {
            v2: typeof getMasked2
        },
        filterBy: {
            v3: typeof filterBy
        }
    },
    items: { [itemId: string]: RItem },
    user: any
}

declare global {
    interface Window {
        R: RolderType
        Rolder: any
        QueryClient: any
        Kuzzle: any
        Noodl: any
        KuzzleInit: { Kuzzle: typeof Kuzzle, WebSocket: typeof WebSocket }
    }
}

export { }
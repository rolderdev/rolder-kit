import { set } from './just'

import { derive, underive } from 'derive-valtio'
import { proxy, ref, snapshot, subscribe, useSnapshot } from 'valtio'
import { subscribeKey, watch } from 'valtio/utils'
const valtio = { proxy, ref, useSnapshot, snapshot, subscribe, subscribeKey, watch, derive, underive }
export type Valtio = typeof valtio
set(window, ['R', 'libs', 'valtio'], valtio)

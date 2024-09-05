import { set } from './just';

import { proxy, ref, useSnapshot, snapshot, subscribe } from 'valtio';
import { proxyMap, subscribeKey, watch } from 'valtio/utils';
import { derive, underive } from 'derive-valtio';
const valtio = { proxy, ref, useSnapshot, snapshot, subscribe, subscribeKey, watch, proxyMap, derive, underive };
export type Valtio = typeof valtio;
set(window, ['R', 'libs', 'valtio'], valtio);

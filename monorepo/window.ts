import { Kuzzle, WebSocket } from 'kuzzle-sdk'
const kuzzle = new Kuzzle(new WebSocket(`rolder.app`, { port: 443 }))
import dayjs from 'dayjs'
import cookies from 'js-cookie';
import clone from "just-clone";
import map from "just-map-object";
import typeOf from "just-typeof"
import flush from "just-flush";
import { isNil } from 'lodash'

declare type RolderType = {
    states: {
        inited?: boolean
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
        sessionTimeout?: string
        defaults?: {
            dateFormat: string
        }
    }
    libs: {
        Kuzzle: typeof kuzzle
        dayjs: typeof dayjs
        cookies: typeof cookies
        clone: typeof clone
        map: typeof map
        typeOf: typeof typeOf
        flush: typeof flush
        isNil: typeof isNil
    }
}

declare global {
    interface Window {
        R: RolderType
        Rolder: any
        QueryClient: any
        Kuzzle: any
        Noodl: any
        KuzzleInit: any
    }
}

export { }
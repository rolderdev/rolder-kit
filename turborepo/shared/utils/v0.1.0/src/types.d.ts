import { RolderType } from "@rk/types"
import getValue6 from "./getValue/6/getValue"
import getValue7 from "./getValue/7/getValue"
import getValue8 from "./getValue/8/getValue"
import getFormatedDate2 from "./getFormatedDate/2/getFormatedDate"
import getMasked2 from "./getMasked/2/getMasked"
import filterBy3 from "./filterBy/3/filterBy"

type R = RolderType & {
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
        }
        filterBy: {
            v3: typeof filterBy3
        }        
    }
}

declare global {
    interface Window {
        R: R
        Noodl: any
        //KuzzleInit: { Kuzzle: typeof Kuzzle, WebSocket: typeof WebSocket }
    }
}

export { }
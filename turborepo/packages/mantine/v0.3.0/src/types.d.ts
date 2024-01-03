import { RolderType } from "@rk/types"

type R = RolderType & {
    libs: { Kuzzle: any, queryClient: any }
    env: any
    states: any
}

declare global {
    interface Window {
        R: R
        Noodl: any
        QueryClient: any
        Rolder: any
        Kuzzle: any
        KuzzleInit: { Kuzzle: any, WebSocket: any }
    }
}

export { }
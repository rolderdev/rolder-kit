import { QueryClient } from "@tanstack/react-query"
import { Observer } from "kuzzle-sdk"

declare global {
    interface Window {
        Rolder: RolderType
        Noodl: any
        Kuzzle: Kuzzle
        QueryClient: QueryClient
        Clone: any;
        Dayjs: any;
        Ms: any;
        Cookies: any
        Mustache: any
        SetRefs: any
        FilterBy: any
        FormValidators: any
        IsEmpty: any
    }
}

export { }
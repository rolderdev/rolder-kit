import { Suspense, forwardRef, lazy } from "react"
import { CompProps } from "./types"

const Comp = lazy(() => import(
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    './List'
))

export default forwardRef(function (props: CompProps) {
    return <Suspense fallback={null}><Comp {...props} /></Suspense>
})
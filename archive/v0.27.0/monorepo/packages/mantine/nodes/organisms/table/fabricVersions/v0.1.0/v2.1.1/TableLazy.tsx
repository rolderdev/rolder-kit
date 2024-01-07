import { Suspense, forwardRef, lazy } from "react"
import { TableCompProps200 } from "./types/TableCompProps"

const Comp = lazy(() => import(
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    './Table'
))

export default forwardRef(function (props: TableCompProps200) {
    return <Suspense fallback={null}><Comp {...props} /></Suspense>
})
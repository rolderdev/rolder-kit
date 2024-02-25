import { Suspense, lazy } from "react"
import { EmbeddedIconProps010 } from "./types"

const EmbeddedIcon = lazy(() => import(
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    './Comp'
))

export default function (props: EmbeddedIconProps010) {
    return <Suspense fallback={null}><EmbeddedIcon {...props} /></Suspense>
}
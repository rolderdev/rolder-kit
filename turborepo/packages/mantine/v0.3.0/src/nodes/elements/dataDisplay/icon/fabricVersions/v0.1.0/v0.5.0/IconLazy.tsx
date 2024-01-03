import { Suspense, lazy } from 'react'
import { CompProps } from './types'

const Comp = lazy(() => import(
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    './Icon'
))

export default function (props: CompProps) {
    return <Suspense fallback={null}><Comp {...props} /></Suspense>
}
import { Suspense, forwardRef, lazy, useImperativeHandle, useRef } from 'react'
import { CompProps } from './types'

const Comp = lazy(() => import(
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    './App'
))

export default forwardRef(function (props: CompProps, ref) {
    const compRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        setColorScheme() { compRef.current?.setColorScheme() },
        toggleColorScheme() { compRef.current?.toggleColorScheme() },
    }), [])

    return <Suspense fallback={null}><Comp {...props} ref={compRef} /></Suspense>
})
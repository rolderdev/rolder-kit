import { Suspense, forwardRef, lazy, useImperativeHandle, useRef } from "react"
import { TableCompProps200 } from "./types/TableCompProps"

const Comp = lazy(() => import(
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    './Table'
))

export default forwardRef(function (props: TableCompProps200, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        table2ResetSingleSelection() { selectRef.current?.table2ResetSingleSelection() },
        table2ResetMultiSelection() { selectRef.current?.table2ResetMultiSelection() },
        table2ResetSort() { selectRef.current?.table2ResetSort() },
        table2ResetFilters() { selectRef.current?.table2ResetFilters() },
    }), [])

    return <Suspense fallback={null}><Comp {...props} ref={selectRef} /></Suspense>
})
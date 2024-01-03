import { Suspense, forwardRef, lazy, useImperativeHandle, useRef } from "react"
import { TableCompProps200 } from "./types/TableCompProps"

const Comp = lazy(() => import(
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    './Table'
))

export default forwardRef(function (props: TableCompProps200, ref) {
    const compRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        table2ResetSingleSelection() { compRef.current.setSelectedRecord() },
        table2ResetMultiSelection() { compRef.current.setSelectedRecords() },
        table2ResetSort() { compRef.current.setSortStatus() },
        table2ResetFilters() { compRef.current.resetFilters() },
    }), [])

    return <Suspense fallback={null}><Comp {...props} ref={compRef} /></Suspense>
})
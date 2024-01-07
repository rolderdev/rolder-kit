import { Suspense, forwardRef, lazy, useImperativeHandle, useRef } from "react"

const FormSelect = lazy(() => import("./FormSelect"))
const ControlledSelect = lazy(() => import("./ControlledSelect"))

export default forwardRef(function (props: any, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        resetSelected() { selectRef.current?.resetSelected() }
    }), [])

    return <Suspense fallback={null}>
        {props.useForm
            ? <FormSelect {...props} {...props.customProps} ref={selectRef} />
            : <ControlledSelect {...props} {...props.customProps} ref={selectRef} />}
    </Suspense>
})
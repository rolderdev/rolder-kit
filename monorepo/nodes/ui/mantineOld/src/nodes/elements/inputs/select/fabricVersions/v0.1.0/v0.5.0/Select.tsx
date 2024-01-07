import { forwardRef, useImperativeHandle, useRef } from "react"
import FormSelect from "./FormSelect"
import ControlledSelect from "./ControlledSelect"

export default forwardRef(function (props: any, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        resetSelected() { selectRef.current?.resetSelected() }
    }), [])

    return props.useForm
        ? <FormSelect {...props} {...props.customProps} ref={selectRef} />
        : <ControlledSelect {...props} {...props.customProps} ref={selectRef} />
})
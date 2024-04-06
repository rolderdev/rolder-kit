import { forwardRef, useImperativeHandle, useRef } from "react"
import FormMultiSelect from "./FormMultiSelect"
import ControlledMultiSelect from "./ControlledMultiSelect"

export default forwardRef(function (props: any, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        resetSelected() { selectRef.current?.resetSelected() }
    }), [])

    return props.useForm
        ? <FormMultiSelect {...props} {...props.customProps} ref={selectRef} />
        : <ControlledMultiSelect {...props} {...props.customProps} ref={selectRef} />
})
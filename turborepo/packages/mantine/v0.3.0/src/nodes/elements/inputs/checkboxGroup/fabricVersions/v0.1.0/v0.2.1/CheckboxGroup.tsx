import { forwardRef, useImperativeHandle, useRef } from "react"
import FormCheckboxGroup from "./FormCheckboxGroup"
import ControlledCheckboxGroup from "./ControlledCheckboxGroup"

export default forwardRef(function (props: any, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        resetSelected() { selectRef.current?.resetSelected() }
    }), [])

    return props.useForm
        ? <FormCheckboxGroup {...props} {...props.customProps} ref={selectRef} />
        : <ControlledCheckboxGroup {...props} {...props.customProps} ref={selectRef} />
})
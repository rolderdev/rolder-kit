import { forwardRef, useImperativeHandle, useRef } from "react"
import FormDatePickerInput from "./FormDatePickerInput"
import ControlledDatePickerInput from "./ControlledDatePickerInput"

export default forwardRef(function (props: any, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        resetSelected() { selectRef.current?.resetSelected() }
    }), [])

    return props.useForm
        ? <FormDatePickerInput {...props} {...props.customProps} ref={selectRef} />
        : <ControlledDatePickerInput {...props} {...props.customProps} ref={selectRef} />
})
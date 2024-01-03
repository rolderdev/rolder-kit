import { forwardRef, useImperativeHandle, useRef } from "react"
import FormTextInput from "./FormTextInput"
import ControlledTextInput from "./ControlledTextInput"

export default forwardRef(function (props: any, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        resetSelected() { selectRef.current?.reset() }
    }), [])

    return props.useForm
        ? <FormTextInput {...props} {...props.customProps} ref={selectRef} />
        : <ControlledTextInput {...props} {...props.customProps} ref={selectRef} />
})
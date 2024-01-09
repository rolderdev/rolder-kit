import { forwardRef, useImperativeHandle, useRef } from "react"
import FormCheckbox from "./FormCheckbox"
import ControlledCheckbox from "./ControlledCheckbox"

export default forwardRef(function (props: any, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        reset() { selectRef.current?.reset() }
    }), [])

    return props.useForm
        ? <FormCheckbox {...props} {...props.customProps} ref={selectRef} />
        : <ControlledCheckbox {...props} {...props.customProps} ref={selectRef} />
})
import { forwardRef, useImperativeHandle, useRef } from "react"
import FormTextarea from "./FormTextarea"
import ControlledTextarea from "./ControlledTextarea"

export default forwardRef(function (props: any, ref) {

    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({ reset() { selectRef.current?.reset() } }), [])

    return props.useForm
        ? <FormTextarea {...props} {...props.customProps} ref={selectRef} />
        : <ControlledTextarea {...props} {...props.customProps} ref={selectRef} />
})
import { forwardRef, useImperativeHandle, useRef } from "react"
import FormNumberInput from "./FormNumberInput"
import ControlledNumberInput from "./ControlledNumberInput"

export default forwardRef(function (props: any, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        reset() { selectRef.current?.reset() },
        increment() { selectRef.current?.increment() },
        decrement() { selectRef.current?.decrement() },
    }), [])

    return props.useForm
        ? <FormNumberInput {...props} {...props.customProps} ref={selectRef} />
        : <ControlledNumberInput {...props} {...props.customProps} ref={selectRef} />
})
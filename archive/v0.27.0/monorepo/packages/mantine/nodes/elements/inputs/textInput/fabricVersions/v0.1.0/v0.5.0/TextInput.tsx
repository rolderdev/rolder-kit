import { forwardRef } from "react"
import FormTextInput from "./FormTextInput"
import ControlledTextInput from "./ControlledTextInput"

export default forwardRef(function (props: any) {

    return props.useForm
        ? <FormTextInput {...props} {...props.customProps} />
        : <ControlledTextInput {...props} {...props.customProps} />
})
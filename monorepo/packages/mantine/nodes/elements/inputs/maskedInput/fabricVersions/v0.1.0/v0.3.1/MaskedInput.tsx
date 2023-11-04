import { forwardRef } from "react"
import FormMaskedInput from "./FormMaskedInput"
import ControlledMaskedInput from "./ControlledMaskedInput"

export default forwardRef(function (props: any) {

    return props.useForm
        ? <FormMaskedInput {...props} {...props.customProps} />
        : <ControlledMaskedInput {...props} {...props.customProps} />
})
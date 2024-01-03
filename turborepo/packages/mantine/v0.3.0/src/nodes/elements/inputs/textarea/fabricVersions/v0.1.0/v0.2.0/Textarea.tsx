import { forwardRef } from "react"
import FormTextarea from "./FormTextarea"
import ControlledTextarea from "./ControlledTextarea"

export default forwardRef(function (props: any) {

    return props.useForm
        ? <FormTextarea {...props} {...props.customProps} />
        : <ControlledTextarea {...props} {...props.customProps} />
})
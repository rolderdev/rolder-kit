import { forwardRef } from "react"
import FormSegmentedControl from "./FormSegmentedControl"
import ControlledSegmentedControl from "./ControlledSegmentedControl"

export default forwardRef(function (props: any) {

    return props.useForm
        ? <FormSegmentedControl {...props} {...props.customProps} />
        : <ControlledSegmentedControl {...props} {...props.customProps} />
})
import { Divider } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <Divider
        variant={props.dividerVariant}
        orientation={props.dividerOrientation}
        labelPosition={props.dividerLabelPosition}
        {...props}
        {...props.customProps}>
        {props.children}
    </Divider>
})
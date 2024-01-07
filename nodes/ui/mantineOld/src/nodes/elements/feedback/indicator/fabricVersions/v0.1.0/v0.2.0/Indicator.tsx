import { Indicator } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <Indicator
        size={props.sizeUnits}
        position={props.indicatorPosition}
        processing={props.indicatorProcessing}
        {...props}
        {...props.customProps}
    >
        {props.children}
    </Indicator>
})
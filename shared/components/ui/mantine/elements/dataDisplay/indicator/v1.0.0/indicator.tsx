import { forwardRef } from "react"
import { Props } from "./types"
import React from "react"
import { Indicator } from "@mantine/core"

export default forwardRef(function (props: Props) {
    
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
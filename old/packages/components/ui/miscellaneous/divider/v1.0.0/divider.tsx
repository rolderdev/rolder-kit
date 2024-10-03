import { Divider } from "@mantine/core"
import { forwardRef } from "react"
import type { Props } from "./types"
import { getCompProps } from "@packages/get-comp-props"

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    return <Divider
        variant={p.dividerVariant}
        orientation={p.dividerOrientation}
        labelPosition={p.dividerLabelPosition}
        {...p}
        {...p.customProps}
    >
        {props.children}
    </Divider>
})

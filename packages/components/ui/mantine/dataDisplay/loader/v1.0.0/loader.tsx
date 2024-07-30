import { forwardRef } from "react"
import type { Props } from "./types"
import { Loader } from "@mantine/core"

export default forwardRef(function (props: Props) {
    return <Loader
        variant={props.loaderVariant}
        {...props}
        {...props.customProps}
    />
})

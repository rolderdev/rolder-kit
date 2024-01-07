import { Loader } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <Loader
        variant={props.loaderVariant}
        {...props}
        {...props.customProps}
    />
})
import { Image } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <Image
        src={props.sourceUrl}
        {...props}
        {...props.customProps}
    />
})
import { forwardRef } from "react"
import type { Props } from "./types";;

export default forwardRef(function (props: Props) {

    return <>{props.children}</>
})

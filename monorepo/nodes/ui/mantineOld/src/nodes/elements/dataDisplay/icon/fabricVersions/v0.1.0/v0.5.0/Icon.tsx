import { forwardRef } from "react"
import getCompProps from "../../../../../../../libs/nodesFabric/v0.1.0/getCompProps/v0.1.0/getCompProps"
import { CompProps } from "./types"
import useScope from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope"
import EmbeddedIcon from "../../../../../../../libs/embeddedIcon/v0.1.0/EmbeddedIcon"

export default forwardRef(function (props: CompProps) {
    const scope = useScope(props.scope, 'v0.1.0')
    const item = props.useScope && scope && scope.item.get()
    const p = { ...getCompProps(props, item) } as CompProps
    return <EmbeddedIcon {...p} />
})
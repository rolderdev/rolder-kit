import { Image } from "@mantine/core"
import { forwardRef } from "react"
import { CompProps } from "./types"
import useScope from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope"
import getCompProps from "../../../../../../../libs/nodesFabric/v0.1.0/getCompProps/v0.1.0/getCompProps"

export default forwardRef(function (props: CompProps) {
    const scope = useScope(props.scope, 'v0.1.0')
    const item = props.useScope && scope && scope.item.get()
    const p = { ...getCompProps (props, item) } as CompProps
    return <Image
        src={p.sourceUrl}
        {...p}
        {...p.customProps}
    />
})
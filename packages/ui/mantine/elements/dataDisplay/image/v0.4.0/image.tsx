import { Image } from "@mantine/core"
import { forwardRef } from "react"
import { CompProps } from "./types"
//import useScope from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope"
import { getCompProps } from '@rk/port'
import icons from '@rk/icons'

export default forwardRef(function (props: CompProps, ref) {

    //const scope = useScope(props.scope, 'v0.1.0')
    //const item = props.useScope && scope && scope.item.get()

    const p = { ...getCompProps(props) } as CompProps
    const imageProps = { ...p }
    delete imageProps.placeholderIconSize
    return <Image
        placeholder={<icons.IconPhoto size={p.placeholderIconSize} />}
        {...imageProps}
        {...imageProps.customProps}
    />
})
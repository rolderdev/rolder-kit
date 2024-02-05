import { Image } from "@mantine/core"
import { forwardRef } from "react"
import { Props } from "./types"
import React from "react"
import icons from '@shared/icons'
import { scopes } from "@shared/scope"
import { getCompProps } from "@shared/get-comp-props"

export default forwardRef(function (props: Props) {    
    const item = props.useScope && props.scope && scopes[props.scope]().get()

    const p = { ...getCompProps(props, item) } as Props
    const imageProps = { ...p }
    delete imageProps.placeholderIconSize

    return <Image
        placeholder={<icons.IconPhoto size={p.placeholderIconSize} />}
        {...imageProps}
        {...imageProps.customProps}
    />
})
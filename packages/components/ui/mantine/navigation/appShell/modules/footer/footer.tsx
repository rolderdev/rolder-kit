import { forwardRef } from "react"
import React from "react"
import type { Props } from "./types"
import { Footer } from "@mantine/core"
import { getCompProps } from '@packages/get-comp-props'

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    return <Footer
        withBorder={p.footerWithBorder}
        height={p.footerHeight}
        {...p}
        {...p.customProps}
    >
        {props.children}
    </Footer>
})

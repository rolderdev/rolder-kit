import { forwardRef } from "react"
import React from "react"
import type { Props } from "./types"
import { Navbar } from "@mantine/core"
import { getCompProps } from '@packages/get-comp-props'

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    return <Navbar.Section
        {...p}
        {...p.customProps}
    >
        {props.children}
    </Navbar.Section>
})

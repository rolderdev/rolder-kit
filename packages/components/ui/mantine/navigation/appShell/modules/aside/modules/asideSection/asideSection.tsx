import { forwardRef } from "react"
import type { Props } from "./types"
import { Aside } from "@mantine/core"
import { getCompProps } from '@packages/get-comp-props'

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    return <Aside.Section
        {...p}
        {...p.customProps}
    >
        {props.children}
    </Aside.Section>
})

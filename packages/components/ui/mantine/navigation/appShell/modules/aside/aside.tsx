import { forwardRef } from "react"
import type { Props } from "./types"
import { Aside, MediaQuery } from "@mantine/core"
import { getCompProps } from '@packages/get-comp-props'

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    return <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <Aside
            withBorder={p.asideWithBorder}
            width={p.asideWidth}
            hiddenBreakpoint={p.asideHiddenBreakpoint}
            {...p}
            {...p.customProps}
        >
            {props.children}
        </Aside >
    </MediaQuery>
})

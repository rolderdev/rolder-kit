import { forwardRef } from "react"
import type { Props } from "./types";
import React from "react";
import { Group } from "@mantine/core";
import { getCompProps } from '@packages/get-comp-props'

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    return <Group
        position={p.groupPosition}
        spacing={p.groupSpacing}
        {...p}
        {...p.customProps}
    >
        {props.children}
    </Group>
})

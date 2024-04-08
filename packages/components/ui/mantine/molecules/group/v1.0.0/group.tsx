import { forwardRef } from "react"
import type { Props } from "./types";
import React from "react";
import { Group } from "@mantine/core";

export default forwardRef(function (props: Props) {

    return <Group
        position={props.groupPosition}
        spacing={props.groupSpacing}
        {...props}
        {...props.customProps}
    >
        {props.children}
    </Group>
})
import { forwardRef } from "react"
import { Props } from "./types";
import React from "react";
import { Paper } from "@mantine/core";

export default forwardRef(function (props: Props) {

    return <Paper
        {...props}
        {...props.customProps}
    >
        {props.children}
    </Paper>
})
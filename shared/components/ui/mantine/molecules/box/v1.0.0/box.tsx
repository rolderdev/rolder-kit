import { forwardRef } from "react"
import { Props } from "./types";
import React from "react";
import { Box } from "@mantine/core";

export default forwardRef(function (props: Props) {

    return <Box
        {...props}
        {...props.customProps}
    >
        {props.children}
    </Box>
})
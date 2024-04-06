import { forwardRef } from "react"
import type { Props } from "./types";
import React from "react";

export default forwardRef(function (props: Props) {

    return <>{props.children}</>
})
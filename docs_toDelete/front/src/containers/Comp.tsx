import { Group } from "@mantine/core";
import React from 'react'
import App from "./App";

export default function (props: any) {
    return <App><Group p='md' position='center' w={props.w || '60%'}>{props.children}</Group></App>
}
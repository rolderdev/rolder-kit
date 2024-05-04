import { forwardRef } from "react"
import type { Props } from "./types";
import React from "react";
import { Tabs } from "@mantine/core";
import { getCompProps } from '@packages/get-comp-props'
import convertColor from "@packages/convert-color"
import { sendSignal } from "@packages/port-send";

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    const Icon = p.iconName && R.libs.icons[p.iconName]

    return <Tabs.Tab
        icon={Icon && <Icon size={p.iconSize} stroke={p.iconStroke} color={convertColor(p.iconColor)} />}
        onClick={() => sendSignal(props.noodlNode, 'clicked')}
        {...p}
        {...p.customProps}
    >
        {p.label}
    </Tabs.Tab>
})

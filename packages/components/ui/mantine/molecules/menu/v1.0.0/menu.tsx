import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import type { Props } from "./types";
import React from "react";
import { Menu, Box } from "@mantine/core";
import { sendOutput, sendSignal } from "@packages/port-send"

const Target = forwardRef((props, ref: any) => <Box ref={ref} {...props} w='fit-content' />)

export default forwardRef(function (props: Props, ref) {
    const children: any = props.children

    const target = Array.isArray(children)
        ? children.filter(i => i.props.noodlNode.model?.type.split('.')[1] === 'MenuTarget')?.[0]
        : children?.props.noodlNode.model?.type.split('.')[1] === 'MenuTarget'
            ? children
            : null

    const dropdown = Array.isArray(children)
        ? children.filter(i => i.props.noodlNode.model?.type.split('.')[1] === 'MenuDropdown')?.[0]
        : children?.props.noodlNode.model?.type.split('.')[1] === 'MenuDropdown'
            ? children
            : null

    const [opened, setOpened] = useState(false)
    useImperativeHandle(ref, () => ({
        open() { setOpened(true) },
        close() { setOpened(false) }
    }), [])
    useEffect(() => {
        sendOutput(props.noodlNode, 'opened', opened)
        if (!opened) sendSignal(props.noodlNode, 'closed')
    }, [opened])

    return target
        ? <Menu
            opened={opened}
            onChange={setOpened}
            {...props}
            {...props.customProps}
        >
            <Menu.Target>{
                //@ts-ignore
                <Target children={target} />
            }</Menu.Target>
            <Menu.Dropdown>
                {dropdown}
            </Menu.Dropdown>
        </Menu >
        : null
})

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import type { Props } from "./types";
import React from "react";
import { Box, Popover } from "@mantine/core";
import { sendOutput, sendSignal } from "@packages/port-send"

const Target = forwardRef((props, ref: any) => <Box ref={ref} {...props} w='fit-content' />)

export default forwardRef(function (props: Props, ref) {
    const children: any = props.children

    const target = Array.isArray(children)
        ? children.filter(i => i.props.noodlNode.model?.type.split('.')[1] === 'PopoverTarget')?.[0]
        : children?.props.noodlNode.model?.type.split('.')[1] === 'PopoverTarget'
            ? children
            : null

    const dropdown = Array.isArray(children)
        ? children.filter(i => i.props.noodlNode.model?.type.split('.')[1] === 'PopoverDropdown')?.[0]
        : children?.props.noodlNode.model?.type.split('.')[1] === 'PopoverDropdown'
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
        ? <Popover
            opened={opened}
            onChange={setOpened}
            {...props}
            {...props.customProps}
        >
            <Popover.Target>{
                //@ts-ignore
                <Target children={target} />
            }</Popover.Target>
            <Popover.Dropdown>
                {dropdown}
            </Popover.Dropdown>
        </Popover >
        : null
})
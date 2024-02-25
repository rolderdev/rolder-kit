import { ActionIcon, Button, Popover } from "@mantine/core"
import { forwardRef, useImperativeHandle, useState } from "react"
import icons from "../../../../../../libs/icons/v0.2.0/icons";

export default forwardRef(function (props: any, ref) {
    const Icon = props.iconName ? icons(props.iconName) : icons('IconGhostFilled')

    const [opened, setOpened] = useState(false);
    useImperativeHandle(ref, () => ({ close() { setOpened(false) }, }), [])

    return <Popover
        position={props.popoverPosition}
        opened={opened}
        onChange={setOpened}
        {...props}
        {...props.customProps}
    >
        <Popover.Target>
            {props.popoverTarget === 'actionIcon'
                ? <ActionIcon
                    variant={props.popoverActionIconVariant}
                    onClick={() => setOpened((o) => !o)}
                    {...props}
                    {...props.customProps}
                >
                    <Icon
                        size={props.iconSize}
                        stroke={props.stroke}
                    />
                </ActionIcon>
                : props.popoverTarget === 'button'
                    ? <Button
                        type={props.buttonType}
                        variant={props.popoverButtonVariant}
                        leftIcon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
                        onClick={() => setOpened((o) => !o)}
                        {...props}
                        {...props.customProps}
                    >
                        {props.popoverButtonLabel}
                    </Button>
                    : undefined}
        </Popover.Target>
        <Popover.Dropdown>{props.children}</Popover.Dropdown>
    </Popover >
})
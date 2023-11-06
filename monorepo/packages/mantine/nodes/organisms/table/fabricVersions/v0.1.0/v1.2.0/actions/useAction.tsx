import { ActionIcon } from "@mantine/core";
import { MRT_Row } from "mantine-react-table";
import { TableCompProps } from "../types/TableCompProps";
import { ActionDef } from "../types/Column";
import icons from "../../../../../../../libs/icons/v0.2.0/icons";
import { sendOutput } from "../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send";

export default function (tableProps: TableCompProps, actionDef: ActionDef, row: MRT_Row<RItem>) {
    const { name, type, disabledSource, actionIconProps, iconProps } = actionDef
    const { noodlNode } = tableProps
    const { getValue } = window.R.utils

    switch (type) {
        case 'ActionIcon': {
            const Icon = iconProps?.name && icons(iconProps.name)
            const value = disabledSource && getValue.v7(row?.original, disabledSource)
            let disabled = false
            if (disabledSource) {
                if (Array.isArray(value) && !value?.length) disabled = true
                else if (!value) disabled = true
            }
            return Icon && <ActionIcon
                onClick={(e) => {
                    e.stopPropagation()
                    sendOutput(noodlNode, 'actionItem', row?.original)
                    sendOutput(noodlNode, 'actionName', name)
                    sendOutput(noodlNode, 'actionName', 'init')
                }}
                disabled={disabled}
                {...actionIconProps}
            >
                {Icon && <Icon {...iconProps} />}
            </ActionIcon>
        }
    }
}
import { ActionIcon } from "@mantine/core";
import icons from "../../../../../../libs/icons/v0.2.0/icons";
import { Action } from "../types/Column";
import { MRT_Row } from "mantine-react-table";
import { getValue } from "../../../../../../utils/data/v0.3.0/data";
import { Selection } from "../types/Selection";
import { TableCompProps } from "../types/TableCompProps";
import { sendOutput } from "../../../../../../main/ports/send/v0.3.0/send";

export default function useAction(props: { tableProps: TableCompProps, selectionProps: Selection, actionDef: Action, row: MRT_Row<NItem>, }) {
    const { name, type, disabledSource, props: actionProps } = props.actionDef
    const { node } = props.tableProps
    const { row } = props

    switch (type) {
        case 'ActionIcon': {
            const Icon = icons(actionProps.icon.iconName)
            const value = getValue(row?.original, disabledSource)
            let disabled = false
            if (disabledSource) {
                if (Array.isArray(value) && !value?.length) disabled = true
                else if (!value) disabled = true
            }
            return <ActionIcon
                onClick={(e) => {
                    e.stopPropagation()
                    sendOutput(node, 'actionItem', row?.original)
                    sendOutput(node, 'actionName', name)
                    sendOutput(node, 'actionName', 'init')
                }}
                disabled={disabled}
                {...actionProps.actionIcon}
            >
                <Icon {...actionProps.icon} />
            </ActionIcon>
        }
    }
}
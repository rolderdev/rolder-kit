import { ActionIcon } from "@mantine/core";
import icons from "../../../../../../libs/icons/v0.2.0/icons";
import { Action } from "../types/Column";
import { MRT_Row } from "mantine-react-table";
import { getValue } from "../../../../../../utils/data/v0.3.0/data";
import { NodeInstance } from "../../../../../../main/getNodes/v0.5.0/types";

export default function useAction(loacalProps: { node: NodeInstance, actionDef: Action, row?: MRT_Row<Item> }) {
    const { node, actionDef: { name, type, disabledSource, props }, row } = loacalProps
    switch (type) {
        case 'ActionIcon': {
            const Icon = icons(props.icon.iconName)
            const value = getValue(row?.original, disabledSource)
            let disabled = false
            if (disabledSource) {
                if (Array.isArray(value) && !value?.length) disabled = true
                else if (!value) disabled = true
            }
            return <ActionIcon
                onClick={(e) => {
                    e.stopPropagation()
                    node.outputPropValues.selectedItem = row?.original
                    node.flagOutputDirty('selectedItem')
                    node.outputPropValues.actionName = name
                    node.flagOutputDirty('actionName')
                    node.outputPropValues.actionName = 'init'
                    node.flagOutputDirty('actionName')
                }}
                disabled={disabled}
                {...props.actionIcon}
            >
                <Icon {...props.icon} />
            </ActionIcon>
        }
    }
}
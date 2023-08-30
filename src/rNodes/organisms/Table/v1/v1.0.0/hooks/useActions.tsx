import { ActionIcon } from "@mantine/core";
import { NodeInstance } from "@noodl/noodl-sdk";
import icons from "../../../../../../libs/icons/v0.2.0/icons";
import { Action } from "../types/Column";
import { MRT_Row } from "mantine-react-table";
import { getValue } from "../../../../../../utils/data/v0.3.0/data";

export default function useActions(loacalProps: { noodlNode: NodeInstance, actionDef: Action, row?: MRT_Row<Item> }) {
    const { noodlNode, actionDef: { name, type, disabledSource, props }, row } = loacalProps
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
                    noodlNode.outputPropValues.selectedItem = row?.original
                    noodlNode.flagOutputDirty('selectedItem')
                    noodlNode.outputPropValues.actionName = name
                    noodlNode.flagOutputDirty('actionName')
                    noodlNode.outputPropValues.actionName = 'init'
                    noodlNode.flagOutputDirty('actionName')
                }}
                disabled={disabled}
                {...props.actionIcon}
            >
                <Icon {...props.icon} />
            </ActionIcon>
        }
    }
}
import clone from "just-clone";
import data from "./ports/data";
import signals from "./ports/signals";
import states from "./ports/states";
import params from "./ports/params";

const ports = [...data, ...signals, ...states, ...params]

export type PortsNames = typeof ports[number]['name']

export const groupedPorts = {
    /*  'Margins': ['margins', 'm', 'my', 'mx', 'mt', 'mr', 'mb', 'ml'],
     'Table params': ['columns', 'grouped', 'selectable', 'singleSelect', 'singleUnselectable', 'multiSelect', 'allSelect', 'expandAllAction'],
     'Table layout': ['tableDensity'],
     'Table style': ['loaderSize', 'loaderColor', 'withBorder', 'shadow', 'withColumnBorders', 'radius'],
     'Rows style': ['highlightOnHover', 'onHoverColor', 'backgroundColor', 'highlightSelected', 'selectedColor', 'multiSelectCheckboxColor'],
     'Form': ['useForm', 'formField', 'formHook'],
     'Icon': ['iconName', 'iconSize', 'stroke'],
     'Font': ['fz', 'fw'] */
} satisfies Record<string, PortsNames[]>;
type GroupedPortsNames = keyof typeof groupedPorts

type GroupsNames = typeof ports[number]['group']
type GetPorts = {
    type: 'input' | 'output'
    portsNames?: PortsNames[]
    requiredInputs?: PortsNames[]
    groupsNames?: GroupsNames[]
    customs?: { groupName?: string }
}
export function getPorts(props: GetPorts): NodePort2[] {
    return ports.filter((i: any) =>
        props.portsNames?.includes(i.name) ||
        props.groupsNames?.includes(i.group)
    ).map((i: any) => {
        i.plug = props.type
        if (props.customs?.groupName) i.group = props.customs?.groupName
        if (props.requiredInputs?.includes(i.name)) i.required = true
        return clone(i)
    })
}

type GetGroupedPorts = { type: 'input' | 'output', groupsNames: GroupedPortsNames[], requiredInputs?: PortsNames[] }
export function getGroupedPorts(props: GetGroupedPorts): NodePort2[] {
    let resultPorts: NodePort2[] = []
    props.groupsNames.forEach(groupName => {
        resultPorts = resultPorts.concat(getPorts({
            type: props.type,
            portsNames: groupedPorts[groupName],
            requiredInputs: props.requiredInputs,
            customs: { groupName }
        }))
    })
    return resultPorts
}
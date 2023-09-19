import clone from "just-clone";
import data from "./ports/data";
import signals from "./ports/signals";
import states from "./ports/states";
import params from "./ports/params";
import form from "./ports/form";
import icon from "./ports/icon";
import margins from "./ports/margins";
import dimensions from "./ports/dimensions";
import style from "./ports/style";
import paddings from "./ports/paddings";
import layout from "./ports/layout";
import { NodePort } from "./types";
import font from "./ports/font";
import format from "./ports/format";
import fetch from "./ports/fetch";

const ports = [...data, ...signals, ...states, ...params, ...form, ...icon, ...margins, ...dimensions, ...style, ...paddings, ...layout, ...font,
...format, ...fetch]

export type PortNames = typeof ports[number]['name']

export const groupedPorts = {
    'Margins': ['margins', 'm', 'my', 'mx', 'mt', 'mr', 'mb', 'ml'],
    'Paddings': ['paddings', 'p', 'py', 'px', 'pt', 'pr', 'pb', 'pl'],
    /* 'Table params': ['columns', 'grouped', 'selectable', 'singleSelect', 'singleUnselectable', 'multiSelect', 'allSelect', 'expandAllAction'],
     'Table layout': ['tableDensity'],
     'Table style': ['loaderSize', 'loaderColor', 'withBorder', 'shadow', 'withColumnBorders', 'radius'],
     'Rows style': ['highlightOnHover', 'onHoverColor', 'backgroundColor', 'highlightSelected', 'selectedColor', 'multiSelectCheckboxColor'],*/
    'Form': ['useForm', 'formField', 'formHook'],
    'Icon': ['iconName', 'iconSize', 'stroke'],
    //'Font': ['fz', 'fw']
} satisfies Record<string, PortNames[]>;
type GroupedPortNames = keyof typeof groupedPorts

type GroupNames = typeof ports[number]['group']
type GetPorts = {
    type: 'input' | 'output'
    portNames?: PortNames[]
    requiredInputs?: PortNames[]
    groupNames?: GroupNames[]
    customs?: { groupName?: string }
}
export function getPorts(props: GetPorts): NodePort[] {
    return ports.filter((i: any) =>
        props.portNames?.includes(i.name) ||
        props.groupNames?.includes(i.group)
    ).map((i: any) => {
        i.plug = props.type
        if (props.customs?.groupName) i.group = props.customs?.groupName
        if (props.requiredInputs?.includes(i.name)) i.required = true
        return clone(i)
    })
}

type GetGroupedPorts = { type: 'input' | 'output', groupNames: GroupedPortNames[], requiredInputs?: PortNames[] }
export function getGroupedPorts(props: GetGroupedPorts): NodePort[] {
    let resultPorts: NodePort[] = []
    props.groupNames.forEach(groupName => {
        resultPorts = resultPorts.concat(getPorts({
            type: props.type,
            portNames: groupedPorts[groupName],
            requiredInputs: props.requiredInputs,
            customs: { groupName }
        }))
    })
    return resultPorts
}
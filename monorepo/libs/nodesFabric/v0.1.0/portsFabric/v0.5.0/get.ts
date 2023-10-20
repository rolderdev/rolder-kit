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
import font from "./ports/font";
import format from "./ports/format";
import useData from "./ports/useData";
import table from "./ports/table";
import appShell from "./ports/appShell";

export const customProps: NodePort = { index: 10000, plug: 'input', name: 'customProps', group: 'Advanced', type: 'array', displayName: 'Custom props', isObject: true }

const ports = [...data, ...signals, ...states, ...params, ...form, ...icon, ...margins, ...dimensions, ...style, ...paddings, ...layout,
...font, ...format, ...useData, ...table, ...appShell]

export type PortNames = typeof ports[number]['name']

export const groupedPorts = {
    'Margins': ['margins', 'm', 'my', 'mx', 'mt', 'mr', 'mb', 'ml'],
    'Paddings': ['paddings', 'p', 'py', 'px', 'pt', 'pr', 'pb', 'pl'],
    'Form': ['useForm', 'formField', 'formHook'],
    'Icon': ['iconName', 'iconSize', 'stroke']
} satisfies Record<string, PortNames[]>;
type GroupedPortNames = keyof typeof groupedPorts

export function getPorts(
    type: 'input' | 'output', portNames?: PortNames[], requiredInputs?: PortNames[], customs?: { groupName?: string }
): NodePort[] {
    return ports.filter(i => portNames?.includes(i.name)).map((i: any) => {
        i.plug = type
        if (customs?.groupName) i.group = customs?.groupName
        if (requiredInputs?.includes(i.name)) i.required = true
        return { ...i }
    })
}

export function getGroupedPorts(type: 'input' | 'output', groupNames: GroupedPortNames[], requiredInputs?: PortNames[]): NodePort[] {
    let resultPorts: NodePort[] = []
    groupNames.forEach(groupName => {
        resultPorts = resultPorts.concat(getPorts(
            type,
            groupedPorts[groupName],
            requiredInputs,
            { groupName }
        ))
    })
    return resultPorts
}
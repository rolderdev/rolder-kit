import { getGroupedPorts } from "../funcs/getPort";

export const inputGroups = {
    Icon: getGroupedPorts('input', ['iconName', 'iconSize', 'iconStroke', 'iconColor'], 'Icon'),
    Form: getGroupedPorts('input', ['formField', 'validationType', 'debouncedValidation', 'validationDelay'], 'Form'),
    Margins: getGroupedPorts('input', ['margins', 'm', 'my', 'mx', 'mt', 'mr', 'mb', 'ml'], 'Margins'),
    Paddings: getGroupedPorts('input', ['paddings', 'p', 'py', 'px', 'pt', 'pr', 'pb', 'pl'], 'Paddings'),
}
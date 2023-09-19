import { enums } from "../enums";
import { NodePort } from "../types";

const style = [
    { name: 'radius', group: 'Style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Radius', default: 'md' },
    { name: 'buttonVariant', group: 'Style', type: { name: 'enum', enums: enums.buttonVariants }, displayName: 'Variant', default: 'filled' },
    { name: 'color', group: 'Style', type: 'string', displayName: 'Color', tooltip: 'red, red.5' },
    { name: 'detectColorScheme', group: 'Style', type: 'boolean', displayName: 'Autodetect color scheme', default: false },
    { name: 'colorScheme', group: 'Style', type: { name: 'enum', enums: enums.colorSchemes }, displayName: 'Default color scheme' },
    { name: 'shadow', group: 'Style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Shadow', default: 'sm' },
    { name: 'buttonColor', group: 'Style', type: 'string', displayName: 'Button color' },
    { name: 'modalOpacity', group: 'Style', type: 'number', displayName: 'Opacity', default: 0.6 },
    { name: 'modalBlur', group: 'Style', type: 'number', displayName: 'Blur', default: 2 },
    { name: 'drawerOpacity', group: 'Style', type: 'number', displayName: 'Opacity', default: 0.6 },
    { name: 'drawerBlur', group: 'Style', type: 'number', displayName: 'Blur', default: 2 },
    { name: 'withAsterisk', group: 'Style', type: 'boolean', displayName: 'With asterisk', default: false },
] as const satisfies readonly NodePort[];

export default style
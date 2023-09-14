import { enums } from "../enums";

const style = [
    { name: 'radius', group: 'Style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Radius', default: 'md' },
    { name: 'buttonVariant', group: 'Style', type: { name: 'enum', enums: enums.buttonVariants }, displayName: 'Variant', default: 'filled' },
    { name: 'color', group: 'Style', type: 'string', displayName: 'Color', tooltip: 'red, red.5' },
] as const satisfies readonly NodePort2[];

export default style
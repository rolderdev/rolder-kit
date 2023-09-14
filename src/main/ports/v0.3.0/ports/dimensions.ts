import { enums } from "../enums";

const dimensions = [
    { name: 'size', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', default: 'sm' },
] as const satisfies readonly NodePort2[];

export default dimensions
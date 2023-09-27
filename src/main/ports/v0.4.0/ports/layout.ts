import { enums } from "../enums";
import { NodePort } from "../types";

const layout = [
    { name: 'stackSpacing', group: 'Layout', type: { name: 'enum', enums: enums.sizes }, displayName: 'Spacing', default: 'md' },
    { name: 'fullScreen', group: 'Layout', type: 'boolean', displayName: 'Fullscreen', default: false },
    { name: 'drawerPosition', group: 'Layout', type: { name: 'enum', enums: enums.drawerPositions }, displayName: 'Position', default: 'right' },
] as const satisfies readonly NodePort[];

export default layout
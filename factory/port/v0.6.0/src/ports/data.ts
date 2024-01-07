import { NodePort } from "../../port";

export default [
    { name: 'items', displayName: 'Items', group: 'Data', type: 'array' },
    { name: 'src', displayName: 'Sourceport', group: 'Data', type: 'string' },
] as const satisfies readonly NodePort[]
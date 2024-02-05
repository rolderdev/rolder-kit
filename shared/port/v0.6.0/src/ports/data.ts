import { NodePort } from "../../port";

export default [
    { name: 'items', displayName: 'Items', group: 'Data', type: 'array' },
    { name: 'src', displayName: 'Source', group: 'Data', type: 'string' },    
    { name: 'typedValue', displayName: 'Typed value', group: 'Data', type: 'string' },
    { name: 'blob', displayName: 'Blob', group: 'Data', type: '*' },
] as const satisfies readonly NodePort[]
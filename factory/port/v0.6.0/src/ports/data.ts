import { NodePort } from "../../port";

export default [    
    { name: 'useScope', displayName: 'Use scope', group: 'Scope', type: 'boolean' },    
    { name: 'items', displayName: 'Items', group: 'Data', type: 'array' },
    { name: 'src', displayName: 'Source', group: 'Data', type: 'string' },
] as const satisfies readonly NodePort[]
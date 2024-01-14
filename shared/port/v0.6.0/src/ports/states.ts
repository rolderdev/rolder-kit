import { NodePort } from "../../port";

export default [
    { name: 'fetching', displayName: 'Fetching', group: 'States', type: 'string', default: false },    
] as const satisfies readonly NodePort[]
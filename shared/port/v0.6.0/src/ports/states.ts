import { NodePort } from "../../port";

export default [
    { name: 'fetching', displayName: 'Fetching', group: 'States', type: 'string', default: false },    
    { name: 'disabled', displayName: 'Disabled', group: 'States', type: 'boolean', default: false },
    { name: 'creating', displayName: 'Creating', group: 'States', type: 'string', default: false },    
] as const satisfies readonly NodePort[]
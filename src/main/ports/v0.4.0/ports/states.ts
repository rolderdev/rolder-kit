import { NodePort } from "../types";

const states = [
    { name: 'loading', group: 'States', type: 'boolean', displayName: 'Loading', default: false },    
    { name: 'updating', group: 'States', type: 'boolean', displayName: 'Updating', default: false },
    { name: 'fetching', group: 'States', type: 'boolean', displayName: 'Fetching', default: false },
    { name: 'disabled', group: 'States', type: 'boolean', displayName: 'Disabled', default: false },
    { name: 'creating', group: 'States', type: 'boolean', displayName: 'Creating', default: false },
] as const satisfies readonly NodePort[];

export default states
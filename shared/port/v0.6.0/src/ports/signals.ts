import { NodePort } from "../../port";

export default [
    { name: 'fetch', displayName: 'Fetch', group: 'Signals', type: 'signal' },
    { name: 'fetched', displayName: 'Fetched', group: 'Signals', type: 'signal' },
    { name: 'reset', displayName: 'Reset', group: 'Signals', type: 'signal' },
    { name: 'reseted', displayName: 'Reseted', group: 'Signals', type: 'signal' },
    { name: 'create', displayName: 'Create', group: 'Signals', type: 'signal' },
    { name: 'created', displayName: 'Created', group: 'Signals', type: 'signal' },
    { name: 'nextPage', displayName: 'Next', group: 'Signals', type: 'signal' },
    { name: 'previousPage', displayName: 'Previous', group: 'Signals', type: 'signal' },
] as const satisfies readonly NodePort[]
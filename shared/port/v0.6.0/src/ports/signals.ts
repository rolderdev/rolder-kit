import { NodePort } from "../../port";

export default [
    { name: 'fetch', displayName: 'Fetch', group: 'Signals', type: 'signal' },
    { name: 'fetched', displayName: 'Fetched', group: 'Signals', type: 'signal' }
] as const satisfies readonly NodePort[]
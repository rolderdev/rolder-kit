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
    { name: 'newValueSubmited', displayName: 'New value submited', group: 'Signals', type: 'signal' },
    { name: 'selected', displayName: 'Selected', group: 'Signals', type: 'signal' },
    { name: 'resetSelected', displayName: 'Reset selected', group: 'Signals', type: 'signal' },
    { name: 'changed', displayName: 'Changed', group: 'Signals', type: 'signal' },
    { name: 'checked', displayName: 'Checked', group: 'Signals', type: 'signal' },
    { name: 'close', displayName: 'Close', group: 'Signals', type: 'signal' },
    { name: 'closed', displayName: 'Closed', group: 'Signals', type: 'signal' },
    { name: 'clicked', displayName: 'Clicked', group: 'Signals', type: 'signal' },
    { name: 'increment', displayName: 'Increment', group: 'Signals', type: 'signal' },
    { name: 'decrement', displayName: 'Decrement', group: 'Signals', type: 'signal' },
    { name: 'doubleClicked', displayName: 'Double clicked', group: 'Signals', type: 'signal' },
] as const satisfies readonly NodePort[]
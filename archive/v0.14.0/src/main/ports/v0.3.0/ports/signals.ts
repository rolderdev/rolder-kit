import { NodePort } from "../types";

const signals = [
    { name: 'runQuery', group: 'Signals', type: 'signal', displayName: 'Run query' },
    { name: 'loaded', group: 'Signals', type: 'signal', displayName: 'Loaded' },
    { name: 'reload', group: 'Signals', type: 'signal', displayName: 'Reload' },
    { name: 'update', group: 'Signals', type: 'signal', displayName: 'Update' },
    { name: 'updated', group: 'Signals', type: 'signal', displayName: 'Updated' },
    { name: 'fetch', group: 'Signals', type: 'signal', displayName: 'Fetch' },
    { name: 'fetched', group: 'Signals', type: 'signal', displayName: 'Fetched' },
    { name: 'submited', group: 'Signals', type: 'signal', displayName: 'Submited' },
    { name: 'clicked', group: 'Signals', type: 'signal', displayName: 'Clicked' },
    { name: 'create', group: 'Signals', type: 'signal', displayName: 'Create' },
    { name: 'created', group: 'Signals', type: 'signal', displayName: 'Created' },
    { name: 'init', group: 'Signals', type: 'signal', displayName: 'Init' },
    { name: 'inited', group: 'Signals', type: 'signal', displayName: 'Inited' },
    { name: 'jwtValidationFailed', group: 'Signals', type: 'signal', displayName: 'JWT validation failed' },
    { name: 'jwtValidationSucceed', group: 'Signals', type: 'signal', displayName: 'JWT validation succeed' },
    { name: 'authenticated', group: 'Signals', type: 'signal', displayName: 'Authenticated' },
    { name: 'open', group: 'Signals', type: 'signal', displayName: 'Open' },
    { name: 'close', group: 'Signals', type: 'signal', displayName: 'Close' },
    { name: 'closed', group: 'Signals', type: 'signal', displayName: 'Closed' },
    { name: 'createXlsx', group: 'Signals', type: 'signal', displayName: 'Create XLSX' },
] as const satisfies readonly NodePort[];

export default signals
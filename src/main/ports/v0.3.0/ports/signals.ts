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
] as const satisfies readonly NodePort2[];

export default signals
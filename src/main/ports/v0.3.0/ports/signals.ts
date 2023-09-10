const signals = [
    { name: 'runQuery', group: 'Signals', type: 'signal', displayName: 'Run query' },
    { name: 'loaded', group: 'Signals', type: 'signal', displayName: 'Loaded' },
    { name: 'reload', group: 'Signals', type: 'signal', displayName: 'Reload' },
] as const satisfies readonly NodePort2[];

export default signals
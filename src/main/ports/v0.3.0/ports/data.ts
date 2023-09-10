const data = [
    { name: 'items', group: 'Data', type: { name: 'array', allowConnectionsOnly: true }, displayName: 'Items' },
    { name: 'fetchedCount', group: 'Data', type: 'number', displayName: 'Fetched count' },
    { name: 'totalCount', group: 'Data', type: 'number', displayName: 'Total count' },
    { name: 'searchString', group: 'Data', type: { name: 'string', allowConnectionsOnly: true }, displayName: 'Search string', dependsOn: { name: 'searchEnabled', value: true } },
] as const satisfies readonly NodePort2[];

export default data
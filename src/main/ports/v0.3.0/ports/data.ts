const data = [
    { name: 'items', group: 'Data', type: { name: 'array', allowConnectionsOnly: true }, displayName: 'Items' },
    { name: 'fetchedCount', group: 'Data', type: 'number', displayName: 'Fetched count' },
    { name: 'totalCount', group: 'Data', type: 'number', displayName: 'Total count' },
    { name: 'searchString', group: 'Data', type: { name: 'string', allowConnectionsOnly: true }, displayName: 'Search string', dependsOn: { name: 'searchEnabled', value: true } },
    { name: 'updateItem', group: 'Data', type: 'object', displayName: 'Update item', tooltip: "Example: { dbClass: 'task', id: 'task id', body: {...} }" },
    { name: 'updatedItem', group: 'Data', type: 'object', displayName: 'Updated item' },
    { name: 'updateScheme', group: 'Data', type: { name: 'object', allowConnectionsOnly: true }, displayName: 'Update scheme' },
    { name: 'updatedData', group: 'Data', type: 'object', displayName: 'Updated data' },
    { name: 'createScheme', group: 'Data', type: { name: 'object', allowConnectionsOnly: true }, displayName: 'Create scheme' },
    { name: 'createdData', group: 'Data', type: 'object', displayName: 'Created data' },
    { name: 'updateItems', group: 'Data', type: { name: 'object', allowConnectionsOnly: true }, displayName: 'Update items', tooltip: "Example: { dbClass: 'task', items: [{id: 'id', body: {...} }] }" },
    { name: 'updatedItems', group: 'Data', type: 'array', displayName: 'Updated items' },
] as const satisfies readonly NodePort2[];

export default data
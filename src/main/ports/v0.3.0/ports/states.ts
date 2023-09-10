const states = [
    { name: 'loading', group: 'States', type: 'boolean', displayName: 'Loading', default: false },
    { name: 'searching', group: 'States', type: 'boolean', displayName: 'Searching', default: false, dependsOn: { name: 'searchEnabled', value: true } },
] as const satisfies readonly NodePort2[];

export default states
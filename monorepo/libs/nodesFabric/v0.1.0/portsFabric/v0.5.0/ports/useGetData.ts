import helpers from "../helpers";

export default [
    { name: 'dbClass', group: 'Query params', type: '*', displayName: 'Database class' },
    { name: 'getUsers', group: 'Query params', type: 'boolean', displayName: 'Get users', default: false },
    { name: 'refs', group: 'References', type: 'proplist', displayName: 'References' },
    { name: 'backRefs', group: 'Backward references', type: 'proplist', displayName: 'Backward references' },
    { name: 'filters', group: 'Query params', type: 'array', displayName: 'Filters', isObject: true, tooltip: helpers.filters },
    { name: 'sorts', group: 'Query params', type: 'array', displayName: 'Sorts', tooltip: helpers.sorts },
    { name: 'options', group: 'Query params', type: 'array', displayName: 'Options', isObject: true, tooltip: helpers.options },
    { name: 'searchEnabled', group: 'Search', type: 'boolean', displayName: 'Enable search', default: false },
    { name: 'searchString', group: 'Search', type: { name: 'string', allowConnectionsOnly: true }, displayName: 'Search string', dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'searchScheme', group: 'Search', type: 'array', displayName: 'Search scheme', isObject: true, dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'pending', group: 'States', type: 'boolean', displayName: 'Pending', default: false },
    { name: 'fetching', group: 'States', type: 'boolean', displayName: 'Fetching', default: false },
    { name: 'refetching', group: 'States', type: 'boolean', displayName: 'Refetching', default: false },
    { name: 'searching', group: 'States', type: 'boolean', displayName: 'Searching', default: false, dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'fetched', group: 'Signals', type: 'signal', displayName: 'Fetched' },
    { name: 'founded', group: 'Signals', type: 'signal', displayName: 'Founded', dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'fetch', group: 'Signals', type: 'signal', displayName: 'Fetch' },
    { name: 'refetch', group: 'Signals', type: 'signal', displayName: 'Refetch' },
] as const satisfies readonly NodePort[]
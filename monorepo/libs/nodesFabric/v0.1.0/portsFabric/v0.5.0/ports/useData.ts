import { enums } from "../enums";
import helpers from "../helpers";

export default [
    { name: 'queryType', group: 'Query type', type: { name: 'enum', enums: enums.queryTypes }, displayName: 'Type', default: 'query' },
    { name: 'dbClass', group: 'Query params', type: '*', displayName: 'Database class', dependsOn: [{ name: 'queryType', value: 'query' }] },
    { name: 'fetch', group: 'Signals', type: 'signal', displayName: 'Fetch' },
    { name: 'refetch', group: 'Signals', type: 'signal', displayName: 'Refetch' },
    { name: 'fetchOnMount', group: 'Query params', type: 'boolean', displayName: 'Fetch on mount', default: true },
    { name: 'subscribe', group: 'Query params', type: 'boolean', displayName: 'Subscribe', default: false },
    { name: 'refetchOnFocus', group: 'Query params', type: 'boolean', displayName: 'Refetch on focus', default: true },
    { name: 'getUsers', group: 'Query params', type: 'boolean', displayName: 'Get users', default: false },
    { name: 'references', group: 'References', type: 'proplist', displayName: 'References' },
    { name: 'backReferences', group: 'Backward references', type: 'proplist', displayName: 'Backward references' },
    { name: 'filters', group: 'Query params', type: 'array', displayName: 'Filters', isObject: true, dependsOn: [{ name: 'queryType', value: 'query' }], tooltip: helpers.filters },
    { name: 'sorts', group: 'Query params', type: 'array', displayName: 'Sorts', dependsOn: [{ name: 'queryType', value: 'query' }], tooltip: helpers.sorts },
    { name: 'options', group: 'Query params', type: 'array', displayName: 'Options', isObject: true, dependsOn: [{ name: 'queryType', value: 'query' }], tooltip: helpers.options },
    { name: 'searchEnabled', group: 'Search', type: 'boolean', displayName: 'Enable search', default: false },
    { name: 'searchString', group: 'Search', type: { name: 'string', allowConnectionsOnly: true }, displayName: 'Search string', dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'searchFields', group: 'Search', type: 'array', displayName: 'Search fields', dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'useReferences', group: 'Search', type: 'boolean', displayName: 'Use references', default: true, dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'fetching', group: 'States', type: 'boolean', displayName: 'Fetching', default: false },
    { name: 'refetching', group: 'States', type: 'boolean', displayName: 'Refetching', default: false },
    { name: 'searching', group: 'States', type: 'boolean', displayName: 'Searching', default: false, dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'fetched', group: 'Signals', type: 'signal', displayName: 'Fetched' },
    { name: 'refetched', group: 'Signals', type: 'signal', displayName: 'Refetched' },
    { name: 'founded', group: 'Signals', type: 'signal', displayName: 'Founded', dependsOn: [{ name: 'searchEnabled', value: true }] },
] as const satisfies readonly NodePort[]
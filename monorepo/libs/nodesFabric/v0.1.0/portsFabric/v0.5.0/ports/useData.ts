import { enums } from "../enums";
import helpers from "../helpers";

export default [
    { name: 'queryType', group: 'Query type', type: { name: 'enum', enums: enums.queryTypes }, displayName: 'Type', default: 'query' },
    { name: 'fetch', group: 'Signals', type: 'signal', displayName: 'Fetch' },
    { name: 'fetchOnMount', group: 'Query params', type: 'boolean', displayName: 'Fetch on mount', default: true },
    { name: 'subscribe', group: 'Query params', type: 'boolean', displayName: 'Subscribe', default: false },
    { name: 'dbClass', group: 'Query params', type: '*', displayName: 'Database class', dependsOn: [{ name: 'queryType', value: 'query' }] },
    { name: 'references', group: 'References', type: 'proplist', displayName: 'References' },
    { name: 'customReferences', group: 'Custom references', type: 'proplist', displayName: 'Custom references' },
    { name: 'filters', group: 'Query params', type: 'array', displayName: 'Filters', isObject: true, dependsOn: [{ name: 'queryType', value: 'query' }], tooltip: helpers.filters },
    { name: 'sorts', group: 'Query params', type: 'array', displayName: 'Sorts', dependsOn: [{ name: 'queryType', value: 'query' }], tooltip: helpers.sorts },
    { name: 'options', group: 'Query params', type: 'array', displayName: 'Options', isObject: true, dependsOn: [{ name: 'queryType', value: 'query' }], tooltip: helpers.options },
    { name: 'searchEnabled', group: 'Search', type: 'boolean', displayName: 'Enable search', default: false },
    { name: 'searchString', group: 'Search', type: { name: 'string', allowConnectionsOnly: true }, displayName: 'Search string', dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'searchFields', group: 'Search', type: 'array', displayName: 'Search fields', dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'useReferences', group: 'Search', type: 'boolean', displayName: 'Use references', default: true, dependsOn: [{ name: 'searchEnabled', value: true }] },
    //{ name: 'searchDelay', group: 'Search', type: 'number', displayName: 'Delay (ms)', default: 350, dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'searching', group: 'States', type: 'boolean', displayName: 'Searching', default: false, dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'fetched', group: 'Signals', type: 'signal', displayName: 'Fetched' },
    { name: 'founded', group: 'Signals', type: 'signal', displayName: 'Founded' },
] as const satisfies readonly NodePort[]
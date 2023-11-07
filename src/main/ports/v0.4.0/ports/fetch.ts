import { NodePort } from "../types";
import { enums } from "../enums";

const fetch = [
    { name: 'queryType', group: 'Params', type: { name: 'enum', enums: enums.queryTypes }, displayName: 'Query type', default: 'fetch' },
    { name: 'filters', group: 'Params', type: 'array', displayName: 'Filters', isObject: true, dependsOn: [{ name: 'queryType', value: 'fetch' }], tooltip: "Example: [{ equals: { 'content.firstName': 'Родион' } }]" },
    { name: 'sorts', group: 'Params', type: 'array', displayName: 'Sorts', isObject: true, dependsOn: [{ name: 'queryType', value: 'fetch' }], tooltip: "Example: [{ content.lastName: 'asc' }, { content.firstName: 'asc' }]" },
    { name: 'options', group: 'Params', type: 'array', displayName: 'Options', isObject: true, dependsOn: [{ name: 'queryType', value: 'fetch' }], tooltip: "Example: [{ size: 100 }]" },
    { name: 'searchEnabled', group: 'Params', type: 'boolean', displayName: 'Enabled search', default: false, dependsOn: [{ name: 'queryType', value: 'fetch' }] },
    { name: 'searchString', group: 'Data', type: { name: 'string', allowConnectionsOnly: true }, displayName: 'Search string', dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'dbClasses', group: 'Database classes', type: 'array', displayName: 'Database classes', dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'searchFields', group: 'Search fields', type: 'array', displayName: 'Search fields', tooltip: "Example: content.name.search", dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'searchDelay', group: 'Params', type: 'number', displayName: 'Delay (ms)', default: 350, dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'useReferences', group: 'Params', type: 'boolean', displayName: 'Use references', default: false, dependsOn: [{ name: 'searchEnabled', value: true }] },
    { name: 'searching', group: 'States', type: 'boolean', displayName: 'Searching', default: false, dependsOn: [{ name: 'searchEnabled', value: true }] },
] as const satisfies readonly NodePort[];

export default fetch
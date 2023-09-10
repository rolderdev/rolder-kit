import { enums } from "../enums";

const params = [
    { name: 'dbClass', group: 'Params', type: '*', displayName: 'Database class' },
    { name: 'filters', group: 'Params', type: 'array', displayName: 'Filters', isObject: true, dependsOn: { name: 'queryType', value: 'fetch' }, tooltip: "Example: [{ equals: { 'content.firstName': 'Родион' } }]" },
    { name: 'sorts', group: 'Params', type: 'array', displayName: 'Sorts', dependsOn: { name: 'queryType', value: 'fetch' }, tooltip: "Example: [{ content.lastName: 'asc' }, { content.firstName: 'asc' }]" },
    { name: 'options', group: 'Params', type: 'array', displayName: 'Options', isObject: true, dependsOn: { name: 'queryType', value: 'fetch' }, tooltip: "Example: [{ size: 100 }]" },
    { name: 'subscribe', group: 'Params', type: 'boolean', displayName: 'Subscribe', default: false },
    { name: 'queryType', group: 'Params', type: { name: 'enum', enums: enums.queryTypes }, displayName: 'Query type', default: 'fetch' },
    { name: 'getUsers', group: 'Params', type: 'boolean', displayName: 'Get users', default: false },
    { name: 'searchEnabled', group: 'Params', type: 'boolean', displayName: 'Enabled search', default: false, dependsOn: { name: 'queryType', value: 'fetch' } },
    { name: 'dbClasses', group: 'Database classes', type: 'array', displayName: 'Database classes', dependsOn: { name: 'searchEnabled', value: true } },
    { name: 'searchFields', group: 'Search fields', type: 'array', displayName: 'Search fields', tooltip: "Example: content.name.search", dependsOn: { name: 'searchEnabled', value: true } },
    { name: 'searchDelay', group: 'Params', type: 'number', displayName: 'Delay (ms)', default: 350, dependsOn: { name: 'searchEnabled', value: true } },
] as const satisfies readonly NodePort2[];

export default params
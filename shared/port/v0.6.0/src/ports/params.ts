import { NodePort } from "../../port";

export default [
    { name: 'dbClass', displayName: 'DB class', group: 'Params', type: 'string', customs: { required: 'both' } },
    { name: 'filters', displayName: 'Filters', group: 'Params', type: 'array', customs: { isObject: true } },
    { name: 'sorts', displayName: 'Sorts', group: 'Params', type: 'array', customs: { isObject: true } },
    { name: 'querySize', displayName: 'Size', group: 'Params', type: 'number', default: 10, customs: { required: 'connection' } },
    { name: 'useScope', displayName: 'Use scope', group: 'Scope', type: 'boolean' },
] as const satisfies readonly NodePort[]
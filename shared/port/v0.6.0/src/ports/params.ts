import { NodePort } from "../../port";
import { getType } from '../funcs/getType';

export default [
    { name: 'dbClass', displayName: 'DB class', group: 'Query params', type: 'string', customs: { required: 'both' } },
    { name: 'filters', displayName: 'Filters', group: 'Query params', type: 'array', customs: { isObject: true } },
    { name: 'sorts', displayName: 'Sorts', group: 'Query params', type: 'array' },
    { name: 'querySize', displayName: 'Size', group: 'Query params', type: 'number', default: 10, customs: { required: 'connection' } },
    { name: 'getUsers', displayName: 'Get users', group: 'Query params', type: 'boolean', default: false },
    { name: 'aggQuery', displayName: 'Aggregations', group: 'Query params', type: 'array', customs: { isObject: true } },
    { name: 'searchFields', displayName: 'Search fields', group: 'Search fields', type: 'proplist' },
    { name: 'searchString', displayName: 'Search string', group: 'Search', type: getType('string', 'connection') },    
    { name: 'label', displayName: 'Label', group: 'Params', type: 'string' },
    { name: 'placeholder', displayName: 'Placeholder', group: 'Params', type: 'string' },
    { name: 'error', displayName: 'Error', group: 'Params', type: getType('*', 'connection'), default: false },
    { name: 'iconName', displayName: 'Icon name', group: 'Params', type: 'string' },
] as const satisfies readonly NodePort[]
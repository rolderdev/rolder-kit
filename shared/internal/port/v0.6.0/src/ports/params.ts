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
    {
        name: 'inputError', displayName: 'Error', group: 'Params', type: getType('*', 'connection'), default: false,
        customs: { dependsOn(p) { return p.useScope ? false : true } }
    },
    { name: 'debouncedTyping', displayName: 'Debounced', group: 'Params', type: 'boolean', default: false },
    {
        name: 'typingDelay', displayName: 'Delay (ms)', group: 'Params', type: 'number', default: 350,
        customs: { dependsOn(p) { return p.debouncedTyping ? true : false } }
    },
    { name: 'focusRightSection', displayName: 'Focus right section', group: 'Params', type: 'boolean', default: false },
    {
        name: 'labelField', displayName: 'Label field', group: 'Params', type: 'string', default: 'label',
        customs: { required: 'connection' }
    },
    { name: 'searchable', displayName: 'Searchable', group: 'Params', type: 'boolean', default: true },
    { name: 'clearable', displayName: 'Clearable', group: 'Params', type: 'boolean', default: true },
    { name: 'creatable', displayName: 'Creatable', group: 'Params', type: 'boolean', default: false },
    { name: 'limitMinDate', displayName: 'Limit min date', group: 'Params', type: 'boolean', default: false },
    {
        name: 'minDateOffset', displayName: 'Min date offset', group: 'Params', type: 'number', default: 0,
        customs: { required: 'both', dependsOn(p) { return p.limitMinDate ? true : false } }
    },
    { name: 'description', displayName: 'Description', group: 'Params', type: 'string' },
    { name: 'hideControls', group: 'Params', type: 'boolean', displayName: 'Hide controls', default: false, customs: { required: 'both' } },
    { name: 'min', group: 'Params', type: 'number', displayName: 'Min' },
    { name: 'max', group: 'Params', type: 'number', displayName: 'Max' },
    { name: 'step', group: 'Params', type: 'number', displayName: 'Step', default: 1, customs: { required: 'connection' } },
] as const satisfies readonly NodePort[]
import helpers from "../helpers";

export default [
    { name: 'dbClass', group: 'Query params', type: '*', displayName: 'Database class' },
    { name: 'getUsers', group: 'Query params', type: 'boolean', displayName: 'Get users', default: false },
    { name: 'refs', group: 'References', type: 'proplist', displayName: 'References' },
    { name: 'backRefs', group: 'Backward references', type: 'proplist', displayName: 'Backward references' },
    { name: 'filters', group: 'Query params', type: 'array', displayName: 'Filters', isObject: true, tooltip: helpers.filters },
    { name: 'sorts', group: 'Query params', type: 'array', displayName: 'Sorts', tooltip: helpers.sorts },
    { name: 'options', group: 'Query params', type: 'array', displayName: 'Options', isObject: true, tooltip: helpers.options },
    { name: 'fetching', group: 'States', type: 'boolean', displayName: 'Fetching', default: false },
    { name: 'fetched', group: 'Signals', type: 'signal', displayName: 'Fetched' },
] as const satisfies readonly NodePort[]

export default [
    { name: 'appLoaderColor', group: 'Loader', type: 'color', displayName: 'Color', tooltip: '#073BF5', default: '#073BF5' },
    { name: 'projectDefaults', group: 'Project', type: 'array', displayName: 'Defaults', isObject: true },
] as const satisfies readonly NodePort[];
const states = [
    { name: 'loading', group: 'States', type: 'boolean', displayName: 'Loading', default: false },
    { name: 'updating', group: 'States', type: 'boolean', displayName: 'Updating', default: false },
    { name: 'disabled', group: 'States', type: 'boolean', displayName: 'Disabled', default: false },
    { name: 'creating', group: 'States', type: 'boolean', displayName: 'Creating', default: false },
    { name: 'active', group: 'States', type: 'boolean', displayName: 'Active', default: false },
    { name: 'activateLabel', group: 'States', type: 'string', displayName: 'Activate label' },
    { name: 'deleting', group: 'States', type: 'boolean', displayName: 'Deleting', default: false },
    { name: 'indicatorProcessing', group: 'States', type: 'boolean', displayName: 'Processing', default: false },
    { name: 'executing', group: 'States', type: 'boolean', displayName: 'Executing', default: false },
] as const satisfies readonly NodePort[];

export default states
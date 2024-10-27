import type { NodePort } from '../../port'

export default [
	{ name: 'fetching', displayName: 'Fetching', group: 'States', type: 'boolean', default: false },
	{ name: 'disabled', displayName: 'Disabled', group: 'States', type: 'boolean', default: false },
	{ name: 'creating', displayName: 'Creating', group: 'States', type: 'boolean', default: false },
	{ name: 'updating', displayName: 'Updating', group: 'States', type: 'boolean', default: false },
	{ name: 'deleting', displayName: 'Deleting', group: 'States', type: 'boolean', default: false },
	{ name: 'loading', displayName: 'Loading', group: 'States', type: 'boolean', default: false },
	{ name: 'active', displayName: 'Active', group: 'States', type: 'boolean', default: false },
	{ name: 'opened', displayName: 'Opened', group: 'States', type: 'boolean', default: false },
	{ name: 'checked', displayName: 'Checked', group: 'States', type: 'boolean', default: false },
] as const satisfies readonly NodePort[]

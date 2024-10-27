import type { NodePort } from '../../types'
import { enums } from '../collections/enums'
import { getEnumType } from '../funcs/getType'

export default [
	{ name: 'radius', displayName: 'Radius', group: 'Style', type: getEnumType(enums.sizes), default: 'md' },
	{ name: 'withAsterisk', displayName: 'With asterisk', group: 'Style', type: 'boolean', default: false },
	{ name: 'backgroundColor', displayName: 'Bg color', group: 'Style', type: 'string' },
	{ name: 'color', displayName: 'Color', group: 'Style', type: 'string' },
	{ name: 'opacity', displayName: 'Opacity', group: 'Style', type: 'number', default: 1 },
	{ name: 'shadow', displayName: 'Shadow', group: 'Style', type: getEnumType(enums.sizes), default: 'sm' },
	{ name: 'withBorder', displayName: 'With border', group: 'Style', type: 'boolean' },
] as const satisfies readonly NodePort[]

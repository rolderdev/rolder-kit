import { reactNode } from '@shared/node'
import { enums, getCustomEnumType, getEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

const positions = ['left', 'center', 'right', 'apart']

export default reactNode('Group', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/group-v1.0.0'))
        },
        inputs: [
            ...inputGroups.Margins, ...inputGroups.Paddings,
            getPort({
                plug: 'input', name: 'groupPosition', displayName: 'Position', group: 'Layout', default: 'left',
                type: getCustomEnumType(positions), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'groupSpacing', displayName: 'Spacing', group: 'Layout', default: 'md',
                type: getEnumType(enums.sizes), customs: { required: 'both' }
            }),
            ...getPorts('input', ['customProps', 'grow', 'noWrap', 'w', 'h', 'opacity'])
        ],
    }
}, { moduleName: 'mantine', allowChildren: true })
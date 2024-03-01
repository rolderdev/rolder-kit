import { reactNode } from '@shared/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

const positions = [
    'bottom', 'left', 'right', 'top', 'bottom-end', 'bottom-start', 'left-end', 'left-start',
    'right-end', 'right-start', 'top-end', 'top-start'
]

export default reactNode('Popover', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/popover-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/molecules/popover-v1.0.0')),
        },
        inputs: [
            ...getPorts('input', ['customProps', 'disabled', 'width', 'radius', 'shadow', 'open', 'close']),
            ...inputGroups.Margins, ...inputGroups.Paddings,
            getPort({
                plug: 'input', name: 'withArrow', displayName: 'With arrow', group: 'Style', default: true,
                type: 'boolean', customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'position', displayName: 'Position', group: 'Layout', default: 'bottom',
                type: getCustomEnumType(positions), customs: { required: 'both' }
            }),
        ],
        outputs: getPorts('output', ['opened', 'closed']),
    }
}, { moduleName: 'mantine', allowChildren: true })
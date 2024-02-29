import { reactNode } from '@shared/node'
import { getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Paper', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/paper-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/molecules/paper-v1.0.0')),
        },
        inputs: [
            ...inputGroups.Margins, ...inputGroups.Paddings,
            ...getPorts('input', ['customProps', 'opacity', 'shadow', 'radius', 'withBorder'])
        ]
    }
}, { moduleName: 'mantine', allowChildren: true })
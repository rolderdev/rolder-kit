import { reactNode } from '@shared/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

export default reactNode('NavLink', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/nav-link-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/elements/navigation/nav-link-v1.0.0')),
        },
        inputs: [
            ...inputGroups.Icon,
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'active', 'label', 'color', 'description',
            ]),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope',
                type: getCustomEnumType(['table']), default: 'table', customs: {
                    required: 'connection', dependsOn(p) { return p.useScope ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'navLinkVariant', displayName: 'Variant', group: 'Style',
                type: getCustomEnumType(['light', 'filled', 'outline']), default: 'light', customs: { required: 'connection' }
            }),
            getPort({ plug: 'input', name: 'activateLabel', displayName: 'Activate label', group: 'States', type: 'string' }),
        ],
        outputs: getPorts('output', ['clicked'])
    }
}, { moduleName: 'mantine' })
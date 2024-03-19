import { reactNode } from '@shared/node'
import { getPorts, getPort, getCustomEnumType, inputGroups } from '@shared/port'
import { lazy } from 'react'

export default reactNode('List', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/list-v1.0.0')),
        },
        inputs: [
            ...getPorts('input', ['customProps', 'propsFunction', 'useScope', 'size']),
            ...inputGroups.Icon,
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope', type: getCustomEnumType(['table']),
                default: 'table', customs: {
                    required: 'connection',
                    dependsOn(props) { return props.useScope ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'listScheme', displayName: 'Scheme', group: 'Params', type: 'array',
                customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'listType', displayName: 'Type', group: 'Params', type: getCustomEnumType(['unordered', 'ordered']),
                default: 'unordered', customs: { required: 'both' }
            }),
            getPort({ plug: 'input', name: 'withPadding', displayName: 'With padding', group: 'Layout', type: 'boolean', default: false }),
        ]
    }
}, { moduleName: 'mantine' })
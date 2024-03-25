import { reactNode } from '@shared/node'
import { enums, getCustomEnumType, getEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

export default reactNode('SegmentedControl', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/segmented-control-v1.0.0')),
        },
        inputs: [
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'disabled', 'w', 'radius', 'formField', 'labelField', 'inputItems',
                'defaultItem', 'fullWidth', 'size',
            ]),
            getPort({
                plug: 'input', name: 'orientation', displayName: 'Orientation', group: 'Layout', default: 'horizontal',
                type: getEnumType(enums.orientations),
            }),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope',
                type: getCustomEnumType(['form']), default: 'form', customs: {
                    required: 'connection', dependsOn(p) { return p.useScope ? true : false }
                }
            }),
        ],
        outputs: getPorts('output', ['selected', 'selectedItem'])
    }
})
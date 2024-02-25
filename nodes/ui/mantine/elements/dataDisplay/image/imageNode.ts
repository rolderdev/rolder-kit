import { reactNode } from '@shared/node'
import { getPorts, getPort, getCustomEnumType, getUnitType, defaultUnits, getMantinePort } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Image', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/image-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/elements/dataDisplay/image-v1.0.0')),
        },
        inputs: [
            ...getPorts('input', ['customProps', 'propsFunction', 'useScope', 'src', 'height']),
            getMantinePort('radius', { comp: 'Image', prop: 'radius' }),
            getPort({
                plug: 'input', name: 'width', displayName: 'Width', group: 'Dimensions', type: getUnitType(defaultUnits, '%'),
                default: 100
            }),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope', type: getCustomEnumType(['table']),
                default: 'table', customs: {
                    required: 'connection',
                    dependsOn(props) { return props.useScope ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'withPlaceholder', displayName: 'Placeholder', group: 'Placeholder', type: 'boolean', default: true
            }),
            getPort({
                plug: 'input', name: 'placeholderIconSize', displayName: 'Placeholder icon size', group: 'Placeholder',
                type: getUnitType(defaultUnits, 'px'), default: 24, customs: {
                    dependsOn(props) { return props.withPlaceholder ? true : false }
                }
            }),
        ]
    }
}, { moduleName: 'mantine' })
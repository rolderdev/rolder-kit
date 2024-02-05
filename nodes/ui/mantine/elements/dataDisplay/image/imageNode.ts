import { reactNode } from '@shared/node'
import { getPorts, getPort, getEnumType, enums, getCustomEnumType, getUnitType, defaultUnits, getMantinePort } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Image', {
    'v0.3.0': {
        hashTag: 'deprecated',
        module: {
            default: 'dynamic',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '../../../../mantineOld/src/nodes/elements/dataDisplay/image/fabricVersions/v0.1.0/v0.3.0/Image'))
        },
        inputs: [
            //...getGroupedPorts('input', ['Margins']),
            ...getPorts('input', ['useScope', 'maw']),
            getPort({
                plug: 'input', name: 'radius', displayName: 'Radius', group: 'Style', type: getEnumType(enums.sizes), default: 'md'
            }),
            getPort({ plug: 'input', name: 'sourceUrl', displayName: 'Source', group: 'Data', type: 'string' }),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Placeholder', group: 'Scope',
                type: getCustomEnumType(['table']), default: 'table', customs: {
                    required: 'connection',
                    dependsOn(props) { return props.useScope ? true : false }
                }
            }),
        ]
    },
    'v0.4.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/image-v0.4.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/elements/dataDisplay/image-v0.4.0')),
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
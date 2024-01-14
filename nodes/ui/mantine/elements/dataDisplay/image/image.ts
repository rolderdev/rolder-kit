import { reactNode } from '@shared/node'
import { getPorts, getPort, getEnumType, enums, getCustomEnumType, getUnitType, defaultUnits } from '@shared/port'

export default reactNode('Image', {
    'v0.3.0': {
        hashTag: 'deprecated',
        //@ts-ignore
        module: import('remote/mantine/image-v0.3.0'),
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
        //@ts-ignore
        module: import('remote/mantine/image-v0.4.0'),
        inputs: [
            ...getPorts('input', ['customProps', 'propsFunction', 'useScope', 'src', 'width', 'height']),
            getPort({
                plug: 'input', name: 'radius', displayName: 'Radius', group: 'Style', type: getEnumType(enums.sizes),
                customs: { mantineDefault: { comp: 'Image', prop: 'radius' } }
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
})
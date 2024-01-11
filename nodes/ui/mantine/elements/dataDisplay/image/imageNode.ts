import { defaultUnits, enums, getCustomEnumType, getEnumType, getPort, getPorts, getUnitType } from '@rk/port'
import { CompVersions, reactNode } from '@rk/node'

const compVersions: CompVersions = {
    'v0.3.0': {
        hashTag: 'deprecated',
        module: import('../../../../mantine-old/src/nodes/elements/dataDisplay/image/fabricVersions/v0.1.0/v0.3.0/Image'),
        inputs: [
            //...getGroupedPorts('input', ['Margins']),
            //...getPorts('input', ['useScope', 'scope', 'sourceUrl', 'radius', 'maw'])
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
        module: import('@rk/image-v0.4.0'),
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
}

//===================================================================
export default reactNode('Image', compVersions)
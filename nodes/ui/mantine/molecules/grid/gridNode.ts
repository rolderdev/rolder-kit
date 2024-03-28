import { reactNode } from '@shared/node'
import { enums, getCustomEnumType, getEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

const justifies = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around']
const aligns = ['stretch', 'center', 'flex-start', 'flex-end']

export default reactNode('Grid', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/grid-v1.0.0'))
        },
        inputs: [
            ...inputGroups.Margins, ...inputGroups.Paddings,
            ...getPorts('input', ['customProps', 'grow', 'w', 'h', 'opacity']),
            getPort({
                plug: 'input', name: 'gridColumnsScheme', displayName: 'Columns scheme', group: 'Params',
                type: 'array', customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'gutter', displayName: 'Gutter', group: 'Layout', default: 'md',
                type: getEnumType(enums.sizes), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'gridColumnsCount', displayName: 'Columns count', group: 'Layout', default: 12,
                type: 'number', customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'gridJustify', displayName: 'Justify', group: 'Layout', default: 'flex-start',
                type: getCustomEnumType(justifies), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'gridAlign', displayName: 'Align', group: 'Layout', default: 'stretch',
                type: getCustomEnumType(aligns), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'childIsRepeater', displayName: 'Child is repeater', group: 'Params', default: false,
                type: 'boolean'
            }),
        ],
    }
}, { allowChildren: true })
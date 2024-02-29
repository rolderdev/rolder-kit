import { reactNode } from '@shared/node'
import { enums, getCustomEnumType, getEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

const aligns = ['flex-start', 'center', 'flex-end']
const justifies = ['flex-start', 'center', 'flex-end', 'space-between']
const directions = ['row', 'column', 'row-reverse', 'column-reverse',]
const wraps = ['wrap', 'nowrap', 'wrap-reverse']

export default reactNode('Flex', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/flex-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/molecules/flex-v1.0.0')),
        },
        inputs: [
            ...inputGroups.Margins, ...inputGroups.Paddings,
            getPort({
                plug: 'input', name: 'gap', displayName: 'Gap', group: 'Layout', default: 'md',
                type: getEnumType(enums.sizes), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'rowGap', displayName: 'Row gap', group: 'Layout', default: 'md',
                type: getEnumType(enums.sizes), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'columnGap', displayName: 'Column gap', group: 'Layout', default: 'md',
                type: getEnumType(enums.sizes), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'flexAlign', displayName: 'Align', group: 'Layout', default: 'flex-start',
                type: getCustomEnumType(aligns), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'flexJustify', displayName: 'Justify', group: 'Layout', default: 'flex-start',
                type: getCustomEnumType(justifies), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'flexDirection', displayName: 'Direction', group: 'Layout', default: 'row',
                type: getCustomEnumType(directions), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'flexWrap', displayName: 'Wrap', group: 'Layout', default: 'wrap',
                type: getCustomEnumType(wraps), customs: { required: 'both' }
            }),
            ...getPorts('input', ['customProps', 'w', 'h', 'opacity'])
        ],
    }
}, { moduleName: 'mantine', allowChildren: true })
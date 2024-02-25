import { reactNode } from '@shared/node'
import { enums, getCustomEnumType, getEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

const aligns = ['stretch', 'center', 'flex-start', 'flex-end']
const justifies = ['center', 'flex-start', 'flex-end', 'space-between', 'space-around']

export default reactNode('Stack', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/stack-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/molecules/stack-v1.0.0')),
        },
        inputs: [
            ...inputGroups.Margins, ...inputGroups.Paddings,
            getPort({
                plug: 'input', name: 'stackAlign', displayName: 'Align', group: 'Layout', default: 'stretch',
                type: getCustomEnumType(aligns), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'stackJustify', displayName: 'Justify', group: 'Layout', default: 'center',
                type: getCustomEnumType(justifies), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'stackSpacing', displayName: 'Spacing', group: 'Layout', default: 'md',
                type: getEnumType(enums.sizes), customs: { required: 'both' }
            }),
            ...getPorts('input', ['customProps', 'w', 'h', 'opacity'])
        ],
    }
}, { moduleName: 'mantine', allowChildren: true })    
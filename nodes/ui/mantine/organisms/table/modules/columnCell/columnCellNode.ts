import { reactNode } from '@shared/node'
import { getPorts } from '@shared/port'
import { lazy } from 'react'

export default reactNode('ColumnCell', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/column-cell-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/organisms/table/column-cell-v1.0.0')),
        },
        inputs: getPorts('input', ['table2ColumnIndex', 'table2Controlled']),
    }
}, { moduleName: 'mantine', allowChildren: true })